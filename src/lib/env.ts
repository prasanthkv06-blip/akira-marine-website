export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export const env = {
  get supabaseUrl() { return requireEnv('NEXT_PUBLIC_SUPABASE_URL'); },
  get supabaseAnonKey() { return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'); },
  get supabaseServiceRoleKey() { return requireEnv('SUPABASE_SERVICE_ROLE_KEY'); },
  get adminOwnerEmail() { return requireEnv('ADMIN_OWNER_EMAIL').toLowerCase(); },
  get resendApiKey() { return requireEnv('RESEND_API_KEY'); },
  get appUrl() { return process.env.NEXT_PUBLIC_APP_URL || 'https://akiramarinesolutions.com'; },
};
