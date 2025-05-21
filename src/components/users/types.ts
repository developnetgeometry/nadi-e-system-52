
export interface UserFormData {
  email: string;
  full_name: string;
  user_type: string;
  user_group: string;
  phone_number?: string;
  ic_number: string;
  position_id?: string;
  organization_id?: string;
  organization_role?: string;
  password?: string;
  confirm_password?: string;
  // Technology Partner additional fields
  personal_email?: string;
  join_date?: string;
  qualification?: string;
  dob?: string;
  place_of_birth?: string;
  marital_status?: string;
  race_id?: string;
  religion_id?: string;
  nationality_id?: string;
  assigned_site_id?: string; // Added for tp_site users
}
