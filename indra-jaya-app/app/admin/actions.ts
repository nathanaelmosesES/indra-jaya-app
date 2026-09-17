'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { hashPassword } from '@/scripts/create-password/password'
import { authenticate, isDeveloperUsername, requireDeveloper } from '@/lib/auth'
import { createSession, deleteSession } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import {
  normalizeUsername,
  validateNewInternalUser,
  type NewInternalUserErrors,
  type NewInternalUserInput,
} from '@/lib/internal-user-rules'

export type FormState = { error?: string; success?: string } | undefined

export type CreateUserState =
  | { status: 'error'; message?: string; fieldErrors: NewInternalUserErrors }
  | { status: 'success'; message: string; createdAt: number }
  | undefined

export type DeleteUserState = { error?: string } | undefined

const POSTGRES_UNIQUE_VIOLATION = '23505'
const LOGIN_PAGE = '/admin'
const DASHBOARD_PAGE = '/admin/dashboard'
const USERS_PAGE = '/admin/users'

function readText(formData: FormData, field: string) {
  return String(formData.get(field) ?? '')
}

function readNewInternalUser(formData: FormData): NewInternalUserInput {
  return {
    username: normalizeUsername(readText(formData, 'username')),
    password: readText(formData, 'password'),
    passwordConfirmation: readText(formData, 'passwordConfirmation'),
    role: readText(formData, 'role'),
  }
}

function fieldError(fieldErrors: NewInternalUserErrors): CreateUserState {
  return { status: 'error', fieldErrors }
}

export async function login(_previous: FormState, formData: FormData): Promise<FormState> {
  const username = normalizeUsername(readText(formData, 'username'))
  const password = readText(formData, 'password')
  if (!username || !password) return { error: 'Isi username dan kata sandi.' }

  const user = await authenticate(username, password)
  if (!user) return { error: 'Username atau kata sandi salah.' }

  await createSession({ userId: user.id, username: user.username, role: user.role })
  redirect(DASHBOARD_PAGE)
}

export async function logout() {
  await deleteSession()
  redirect(LOGIN_PAGE)
}

export async function createInternalUser(
  _previous: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  await requireDeveloper()

  const input = readNewInternalUser(formData)
  const fieldErrors = validateNewInternalUser(input)
  if (Object.keys(fieldErrors).length > 0) return fieldError(fieldErrors)
  if (isDeveloperUsername(input.username)) {
    return fieldError({ username: 'Username ini dipakai akun developer.' })
  }

  const { error } = await getSupabaseAdmin()
    .from('internal_users')
    .insert({ username: input.username, role: input.role, password_hash: await hashPassword(input.password) })

  if (error?.code === POSTGRES_UNIQUE_VIOLATION) {
    return fieldError({ username: `Username "${input.username}" sudah dipakai.` })
  }
  if (error) {
    console.error('createInternalUser', error)
    return { status: 'error', message: 'Akun gagal disimpan. Periksa koneksi lalu coba lagi.', fieldErrors: {} }
  }

  revalidatePath(USERS_PAGE)
  return {
    status: 'success',
    message: `Akun ${input.username} (${input.role}) siap dipakai.`,
    createdAt: Date.now(),
  }
}

export async function deleteInternalUser(
  _previous: DeleteUserState,
  formData: FormData,
): Promise<DeleteUserState> {
  await requireDeveloper()

  const id = readText(formData, 'id')
  if (!id) return { error: 'Akun tidak ditemukan.' }

  const { error } = await getSupabaseAdmin().from('internal_users').delete().eq('id', id)
  if (error) {
    console.error('deleteInternalUser', error)
    return { error: 'Gagal menghapus. Coba lagi.' }
  }

  revalidatePath(USERS_PAGE)
  return undefined
}
