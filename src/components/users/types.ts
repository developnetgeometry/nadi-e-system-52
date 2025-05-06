
import { UserType } from "@/types/auth";

export interface UserFormData {
  email: string;
  full_name: string;
  user_type: UserType;
  user_group?: string;
  phone_number?: string;
  ic_number: string;
  password?: string;
  confirm_password?: string;
  gender?: string;
  work_email?: string;
  // Fields for specific user groups (MCMC, TP)
  position_id?: string;
  tech_partner_id?: string;
  // Additional fields for TP users
  personal_email?: string;
  join_date?: string; 
  qualification?: string;
  dob?: string; 
  place_of_birth?: string;
  marital_status?: string;
  race_id?: string;
  religion_id?: string;
  nationality_id?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  user_group?: string;
  phone_number?: string;
  ic_number?: string;
  gender?: string;
  work_email?: string;
}
