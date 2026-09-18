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

const ACCESS_COOKIE = 'ij_access'
const REFRESH_COOKIE = 'ij_refresh'
const SESSION_COOKIE_PATH = '/admin'
const ACCESS_DURATION_SECONDS = 30 * 60
const REFRESH_DURATION_SECONDS = 7 * 24 * 60 * 60
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
  const dotIdx = token.lastIndexOf('.')
  if (dotIdx < 1) return null
  const payload = token.slice(0, dotIdx)
  const signature = token.slice(dotIdx + 1)
  if (!hasValidSignature(payload, signature)) return null

  try {
    const session: Session = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return session.expiresAtEpochSeconds > nowInEpochSeconds() ? session : null
  } catch {
    return null
  }
}

function makeAccessToken(session: NewSession): string {
  return toSignedToken({ ...session, expiresAtEpochSeconds: nowInEpochSeconds() + ACCESS_DURATION_SECONDS })
}

function makeRefreshToken(session: NewSession): string {
  return toSignedToken({ ...session, expiresAtEpochSeconds: nowInEpochSeconds() + REFRESH_DURATION_SECONDS })
}

export async function createSession(newSession: NewSession) {
  const cookieStore = await cookies()
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: SESSION_COOKIE_PATH,
  }
  cookieStore.set(ACCESS_COOKIE, makeAccessToken(newSession), {
    ...base,
    maxAge: ACCESS_DURATION_SECONDS,
  })
  cookieStore.set(REFRESH_COOKIE, makeRefreshToken(newSession), {
    ...base,
    maxAge: REFRESH_DURATION_SECONDS,
  })
}

export async function readSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value
  if (accessToken) {
    const session = fromSignedToken(accessToken)
    if (session) return session
  }
  return null
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete({ name: ACCESS_COOKIE, path: SESSION_COOKIE_PATH })
  cookieStore.delete({ name: REFRESH_COOKIE, path: SESSION_COOKIE_PATH })
}
