import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { verifyPassword } from '@/scripts/create-password/password'
import { getSupabaseAdmin } from './supabase-admin'
import { readSession, type Role } from './session'

export type CurrentUser = { id: string; username: string; role: Role }

const DEVELOPER_ID = 'developer'
const LOGIN_PAGE = '/admin'
const DASHBOARD_PAGE = '/admin/dashboard'

const DECOY_HASH_TO_EQUALIZE_LOGIN_TIME =
  'scrypt:32768:8:1:AAAAAAAAAAAAAAAAAAAAAA:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

function getDeveloperCredentials() {
  const username = process.env.DEV_ADMIN_USERNAME?.trim().toLowerCase()
  const passwordHash = process.env.DEV_ADMIN_PASSWORD_HASH?.trim()
  return username && passwordHash ? { username, passwordHash } : null
}

function developerUser(username: string): CurrentUser {
  return { id: DEVELOPER_ID, username, role: 'developer' }
}

export function isDeveloperUsername(username: string) {
  return getDeveloperCredentials()?.username === username
}

async function findInternalUserByUsername(username: string) {
  const { data, error } = await getSupabaseAdmin()
    .from('internal_users')
    .select('id, username, role, password_hash')
    .eq('username', username)
    .maybeSingle()
  if (error) throw error
  return data
}

async function findInternalUserById(id: string): Promise<CurrentUser | null> {
  const { data } = await getSupabaseAdmin()
    .from('internal_users')
    .select('id, username, role')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function authenticate(username: string, password: string): Promise<CurrentUser | null> {
  const developer = getDeveloperCredentials()
  if (developer?.username === username) {
    const isValid = await verifyPassword(password, developer.passwordHash)
    return isValid ? developerUser(username) : null
  }

  const user = await findInternalUserByUsername(username)
  const isValid = await verifyPassword(password, user?.password_hash ?? DECOY_HASH_TO_EQUALIZE_LOGIN_TIME)
  if (!user || !isValid) return null

  return { id: user.id, username: user.username, role: user.role }
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await readSession()
  if (!session) return null

  if (session.role === 'developer') {
    return isDeveloperUsername(session.username) ? developerUser(session.username) : null
  }

  return findInternalUserById(session.userId)
})

export async function requireUser(allowedRoles?: Role[]) {
  const user = await getCurrentUser()
  if (!user) redirect(LOGIN_PAGE)
  if (allowedRoles && !allowedRoles.includes(user.role)) redirect(DASHBOARD_PAGE)
  return user
}

export function requireDeveloper() {
  return requireUser(['developer'])
}

export function requireOwner() {
  return requireUser(['developer', 'owner'])
}
