export const INTERNAL_ROLES = ['owner', 'staff'] as const
export type InternalRole = (typeof INTERNAL_ROLES)[number]

export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 32
export const USERNAME_PATTERN = /^[a-z0-9._-]{3,32}$/
export const PASSWORD_MIN_LENGTH = 8

export type NewInternalUserInput = {
  username: string
  password: string
  passwordConfirmation: string
  role: string
}

export type NewInternalUserField = keyof NewInternalUserInput
export type NewInternalUserErrors = Partial<Record<NewInternalUserField, string>>

export const USERNAME_HINT = `${USERNAME_MIN_LENGTH} sampai ${USERNAME_MAX_LENGTH} karakter: huruf kecil, angka, titik, strip, atau garis bawah.`

export function normalizeUsername(raw: string) {
  return raw.trim().toLowerCase()
}

export function isInternalRole(role: string): role is InternalRole {
  return (INTERNAL_ROLES as readonly string[]).includes(role)
}

export function validateNewInternalUser(input: NewInternalUserInput): NewInternalUserErrors {
  const errors: NewInternalUserErrors = {}

  if (!input.username) errors.username = 'Username wajib diisi.'
  else if (!USERNAME_PATTERN.test(input.username)) errors.username = USERNAME_HINT

  if (!input.password) errors.password = 'Kata sandi wajib diisi.'
  else if (input.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Kata sandi minimal ${PASSWORD_MIN_LENGTH} karakter.`
  }

  if (!input.passwordConfirmation) errors.passwordConfirmation = 'Ulangi kata sandi.'
  else if (input.passwordConfirmation !== input.password) {
    errors.passwordConfirmation = 'Kata sandi tidak sama.'
  }

  if (!isInternalRole(input.role)) errors.role = 'Pilih salah satu role.'

  return errors
}
