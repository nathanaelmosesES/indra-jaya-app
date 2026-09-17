import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto'

const ALGORITHM = 'scrypt'
const ENV_SAFE_SEPARATOR = ':'
const DEFAULT_COST = { N: 2 ** 15, r: 8, p: 1 }
const KEY_LENGTH_BYTES = 32
const SALT_LENGTH_BYTES = 16
const MAX_MEMORY_BYTES = 64 * 1024 * 1024

type ScryptCost = typeof DEFAULT_COST

function deriveKey(password: string, salt: Buffer, cost: ScryptCost) {
  const options: ScryptOptions = { ...cost, maxmem: MAX_MEMORY_BYTES }
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH_BYTES, options, (error, key) =>
      error ? reject(error) : resolve(key),
    )
  })
}

function serializeHash(cost: ScryptCost, salt: Buffer, key: Buffer) {
  return [ALGORITHM, cost.N, cost.r, cost.p, salt.toString('base64url'), key.toString('base64url')].join(
    ENV_SAFE_SEPARATOR,
  )
}

function parseHash(storedHash: string) {
  const [algorithm, N, r, p, salt, key, ...extra] = storedHash.split(ENV_SAFE_SEPARATOR)
  if (algorithm !== ALGORITHM || !key || extra.length > 0) return null

  const parsed = {
    cost: { N: Number(N), r: Number(r), p: Number(p) },
    salt: Buffer.from(salt, 'base64url'),
    key: Buffer.from(key, 'base64url'),
  }
  return parsed.key.length === KEY_LENGTH_BYTES ? parsed : null
}

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH_BYTES)
  const key = await deriveKey(password, salt, DEFAULT_COST)
  return serializeHash(DEFAULT_COST, salt, key)
}

export async function verifyPassword(password: string, storedHash: string) {
  const parsed = parseHash(storedHash)
  if (!parsed) return false

  try {
    const key = await deriveKey(password, parsed.salt, parsed.cost)
    return timingSafeEqual(key, parsed.key)
  } catch {
    return false
  }
}
