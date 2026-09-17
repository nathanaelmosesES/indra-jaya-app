import { NextResponse, type NextRequest } from 'next/server'

const ACCESS_COOKIE = 'ij_access'
const REFRESH_COOKIE = 'ij_refresh'
const SESSION_COOKIE_PATH = '/admin'
const ACCESS_DURATION_SECONDS = 30 * 60
const REFRESH_DURATION_SECONDS = 7 * 24 * 60 * 60
const LOGIN_PAGE = '/admin'

function base64urlEncode(buf: ArrayBuffer): string {
  const bytes = Array.from(new Uint8Array(buf))
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64urlDecode(str: string): ArrayBuffer {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer as ArrayBuffer
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function verifyToken(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const dotIdx = token.lastIndexOf('.')
  if (dotIdx < 1) return null
  const payload = token.slice(0, dotIdx)
  const signature = token.slice(dotIdx + 1)
  try {
    const key = await getHmacKey(secret)
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64urlDecode(signature),
      new TextEncoder().encode(payload),
    )
    if (!valid) return null
    const session = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)))
    const now = Math.floor(Date.now() / 1000)
    return session.expiresAtEpochSeconds > now ? session : null
  } catch {
    return null
  }
}

async function signToken(payload: Record<string, unknown>, secret: string): Promise<string> {
  const encoded = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)).buffer as ArrayBuffer)
  const key = await getHmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encoded))
  return `${encoded}.${base64urlEncode(sig)}`
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === LOGIN_PAGE || pathname === LOGIN_PAGE + '/') {
    return NextResponse.next()
  }

  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return NextResponse.redirect(new URL(LOGIN_PAGE, request.url))

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value
  if (accessToken) {
    const session = await verifyToken(accessToken, secret)
    if (session) return NextResponse.next()
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
  if (refreshToken) {
    const session = await verifyToken(refreshToken, secret)
    if (session) {
      const now = Math.floor(Date.now() / 1000)
      const newAccess = await signToken(
        { ...session, expiresAtEpochSeconds: now + ACCESS_DURATION_SECONDS },
        secret,
      )
      const response = NextResponse.next()
      response.cookies.set(ACCESS_COOKIE, newAccess, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: SESSION_COOKIE_PATH,
        maxAge: ACCESS_DURATION_SECONDS,
      })
      const newRefresh = await signToken(
        { ...session, expiresAtEpochSeconds: now + REFRESH_DURATION_SECONDS },
        secret,
      )
      response.cookies.set(REFRESH_COOKIE, newRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: SESSION_COOKIE_PATH,
        maxAge: REFRESH_DURATION_SECONDS,
      })
      return response
    }
  }

  return NextResponse.redirect(new URL(LOGIN_PAGE, request.url))
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/users/:path*',
    '/admin/products/:path*',
    '/admin/opname/:path*',
    '/admin/transactions/:path*',
  ],
}
