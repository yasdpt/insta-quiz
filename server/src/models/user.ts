export interface User {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  is_bot?: boolean | null;
  language_code?: string | null;
  is_premium?: boolean | null;
  added_to_attachment_menu?: boolean | null;
  allows_write_to_pm?: boolean | null;
  photo_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
