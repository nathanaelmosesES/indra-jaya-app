import type { Metadata } from 'next'
import AdminLogin from '../../components/AdminLogin'

// Admin area must never be indexed by search engines.
export const metadata: Metadata = {
  title: 'Masuk',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminLogin />
}
