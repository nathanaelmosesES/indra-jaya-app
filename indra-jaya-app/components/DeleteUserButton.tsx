'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { deleteInternalUser } from '@/app/admin/actions'

function DeleteUserButton({ userId, username }: { userId: string; username: string }) {
  const [state, formAction, pending] = useActionState(deleteInternalUser, undefined)
  const [confirming, setConfirming] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (confirming) cancelRef.current?.focus()
  }, [confirming])

  function cancel() {
    setConfirming(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  if (!confirming) {
    return (
      <button
        ref={triggerRef}
        type="button"
        className="admin-btn admin-btn--ghost"
        onClick={() => setConfirming(true)}
        aria-label={`Hapus akun ${username}`}
      >
        Hapus
      </button>
    )
  }

  return (
    <form
      action={formAction}
      className="admin-confirm"
      role="group"
      aria-label={`Konfirmasi hapus ${username}`}
      onKeyDown={(event) => event.key === 'Escape' && cancel()}
    >
      <input type="hidden" name="id" value={userId} />
      <p className="admin-confirm__text">
        {state?.error ?? `Hapus ${username}? Akun tidak bisa dipulihkan.`}
      </p>
      <div className="admin-confirm__actions">
        <button ref={cancelRef} type="button" className="admin-btn admin-btn--ghost" onClick={cancel} disabled={pending}>
          Batal
        </button>
        <button type="submit" className="admin-btn admin-btn--danger" disabled={pending}>
          {pending ? 'Menghapus…' : 'Ya, hapus'}
        </button>
      </div>
    </form>
  )
}

export default DeleteUserButton
