import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getOwnerSession } from '@/lib/auth/owner';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await getOwnerSession())) redirect('/admin/login');
  return <>{children}</>;
}
