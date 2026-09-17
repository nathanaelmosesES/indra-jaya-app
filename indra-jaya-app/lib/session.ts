import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export type Role = 'developer' | 'owner' | 'staff'

export type Session = {
  userId: string
  username: string
  role: Role
  expiresAtEpochSeconds: number
}

type NewSession = Omit<Session, 'expiresAtEpochSeconds'>

const SESSION_COOKIE = 'ij_admin_session'
const SESSION_COOKIE_PATH = '/admin'
const SESSION_DURATION_SECONDS = 8 * 60 * 60
const MIN_SECRET_LENGTH = 32

function getSigningSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(`ADMIN_SESSION_SECRET belum diisi (minimal ${MIN_SECRET_LENGTH} karakter).`)
  }
  return secret
}

function signatureOf(payload: string) {
  return createHmac('sha256', getSigningSecret()).update(payload).digest('base64url')
}

function hasValidSignature(payload: string, signature: string) {
  const expected = Buffer.from(signatureOf(payload))
  const received = Buffer.from(signature)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

function nowInEpochSeconds() {
  return Math.floor(Date.now() / 1000)
}

function toSignedToken(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  return `${payload}.${signatureOf(payload)}`
}

function fromSignedToken(token: string): Session | null {
  const [payload, signature] = token.split('.')
  if (!payload || !signature || !hasValidSignature(payload, signature)) return null

  try {
    const session: Session = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return session.expiresAtEpochSeconds > nowInEpochSeconds() ? session : null
  } catch {
    return null
  }
}

export async function createSession(newSession: NewSession) {
  const session = {
    ...newSession,
    expiresAtEpochSeconds: nowInEpochSeconds() + SESSION_DURATION_SECONDS,
  }
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, toSignedToken(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: SESSION_COOKIE_PATH,
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function readSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? fromSignedToken(token) : null
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete({ name: SESSION_COOKIE, path: SESSION_COOKIE_PATH })
}
