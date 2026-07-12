export interface InviteRow {
  id: string; token: string; invitee_name: string; invitee_email: string;
  status: 'pending' | 'used' | 'expired'; created_at: string; expires_at: string; used_at: string | null;
}
export interface SubmissionRow {
  id: string; invite_id: string; full_name: string; created_at: string;
  photo_path: string; passport_front_path: string; passport_back_path: string;
  [key: string]: unknown;
}
