'use client'

import { useActionState, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { createInternalUser } from '@/app/admin/actions'
import {
  INTERNAL_ROLES,
  PASSWORD_MIN_LENGTH,
  USERNAME_HINT,
  USERNAME_MAX_LENGTH,
  normalizeUsername,
  validateNewInternalUser,
  type InternalRole,
  type NewInternalUserErrors,
  type NewInternalUserField,
  type NewInternalUserInput,
} from '@/lib/internal-user-rules'

const EMPTY_FORM: NewInternalUserInput = { username: '', password: '', passwordConfirmation: '', role: '' }

const FIELD_ORDER: NewInternalUserField[] = ['username', 'password', 'passwordConfirmation', 'role']

const ROLE_OPTIONS: Record<InternalRole, { label: string; description: string }> = {
  owner: { label: 'Owner', description: 'Pemilik usaha' },
  staff: { label: 'Staff', description: 'Tim operasional' },
}

function firstInvalidField(errors: NewInternalUserErrors) {
  return FIELD_ORDER.find((field) => errors[field])
}

function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createInternalUser, undefined)
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<NewInternalUserErrors>({})
  const [showPasswords, setShowPasswords] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const ids = useId()

  const idOf = (field: NewInternalUserField) => `${ids}-${field}`
  const messageIdOf = (field: NewInternalUserField) => `${ids}-${field}-message`

  function focusField(field: NewInternalUserField | undefined) {
    if (!field) return
    formRef.current?.querySelector<HTMLInputElement>(`[name="${field}"]`)?.focus()
  }

  useEffect(() => {
    if (state?.status === 'error') {
      setErrors(state.fieldErrors)
      focusField(firstInvalidField(state.fieldErrors))
    }
    if (state?.status === 'success') {
      setValues(EMPTY_FORM)
      setErrors({})
      setShowPasswords(false)
      focusField('username')
    }
  }, [state])

  function update(field: NewInternalUserField, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const clientErrors = validateNewInternalUser({ ...values, username: normalizeUsername(values.username) })
    if (Object.keys(clientErrors).length === 0) return
    event.preventDefault()
    setErrors(clientErrors)
    focusField(firstInvalidField(clientErrors))
  }

  const confirmationTyped = values.passwordConfirmation.length > 0
  const passwordsMatch = confirmationTyped && values.passwordConfirmation === values.password
  const passwordLongEnough = values.password.length >= PASSWORD_MIN_LENGTH
  const passwordInputType = showPasswords ? 'text' : 'password'

  const fieldProps = (field: NewInternalUserField) => ({
    id: idOf(field),
    name: field,
    value: values[field],
    onChange: (event: { target: { value: string } }) => update(field, event.target.value),
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': messageIdOf(field),
  })

  return (
    <form ref={formRef} className="admin-form" action={formAction} onSubmit={handleSubmit} noValidate>
      <div className="admin-field">
        <label className="admin-field__label" htmlFor={idOf('username')}>
          Username
        </label>
        <input
          {...fieldProps('username')}
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="next"
          maxLength={USERNAME_MAX_LENGTH}
          onChange={(event) => update('username', event.target.value.toLowerCase().replace(/\s/g, ''))}
        />
        <p id={messageIdOf('username')} className={errors.username ? 'admin-field__error' : 'admin-field__hint'}>
          {errors.username ?? USERNAME_HINT}
        </p>
      </div>

      <div className="admin-field">
        <label className="admin-field__label" htmlFor={idOf('password')}>
          Kata sandi
        </label>
        <div className="admin-field__wrap">
          <input
            {...fieldProps('password')}
            type={passwordInputType}
            autoComplete="new-password"
            enterKeyHint="next"
          />
          <button
            type="button"
            className="admin-field__toggle"
            onClick={() => setShowPasswords((visible) => !visible)}
            aria-pressed={showPasswords}
            aria-controls={`${idOf('password')} ${idOf('passwordConfirmation')}`}
          >
            {showPasswords ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>
        <p
          id={messageIdOf('password')}
          className={
            errors.password ? 'admin-field__error' : passwordLongEnough ? 'admin-field__ok' : 'admin-field__hint'
          }
        >
          {errors.password ?? `Minimal ${PASSWORD_MIN_LENGTH} karakter.`}
        </p>
      </div>

      <div className="admin-field">
        <label className="admin-field__label" htmlFor={idOf('passwordConfirmation')}>
          Ulangi kata sandi
        </label>
        <input
          {...fieldProps('passwordConfirmation')}
          type={passwordInputType}
          autoComplete="new-password"
          enterKeyHint="done"
        />
        <p
          id={messageIdOf('passwordConfirmation')}
          className={
            errors.passwordConfirmation
              ? 'admin-field__error'
              : passwordsMatch
                ? 'admin-field__ok'
                : 'admin-field__hint'
          }
          aria-live="polite"
        >
          {errors.passwordConfirmation ??
            (passwordsMatch ? 'Kata sandi sama.' : confirmationTyped ? 'Belum sama.' : 'Ketik ulang untuk memastikan.')}
        </p>
      </div>

      <fieldset
        className="admin-choice"
        aria-invalid={Boolean(errors.role)}
        aria-describedby={errors.role ? messageIdOf('role') : undefined}
      >
        <legend className="admin-field__label">Role</legend>
        <div className="admin-choice__options">
          {INTERNAL_ROLES.map((role) => (
            <label key={role} className="admin-choice__option">
              <input
                type="radio"
                name="role"
                value={role}
                checked={values.role === role}
                onChange={() => update('role', role)}
              />
              <span className="admin-choice__text">
                <strong>{ROLE_OPTIONS[role].label}</strong>
                <small>{ROLE_OPTIONS[role].description}</small>
              </span>
            </label>
          ))}
        </div>
        {errors.role && (
          <p id={messageIdOf('role')} className="admin-field__error">
            {errors.role}
          </p>
        )}
      </fieldset>

      <button type="submit" className="admin-submit" disabled={pending}>
        {pending ? 'Menyimpan…' : 'Buat akun'}
      </button>

      <div aria-live="polite">
        {state?.status === 'error' && state.message && (
          <p className="admin-note admin-note--error" role="alert">
            {state.message}
          </p>
        )}
        {state?.status === 'success' && (
          <p key={state.createdAt} className="admin-note admin-note--success">
            {state.message}
          </p>
        )}
      </div>
    </form>
  )
}

export default CreateUserForm
