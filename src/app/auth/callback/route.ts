import { redirect } from 'next/navigation';
import { getServerClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code');
  if (code) {
    const supabase = await getServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  redirect('/admin');
}
