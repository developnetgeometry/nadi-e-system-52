
import { UserType } from "@/types/auth";

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

export interface CreateUserRequest {
  email: string;
  fullName: string;
  userType: string;
  userGroup?: string;
  phoneNumber?: string;
  icNumber: string;
  password: string;
  createdBy?: string;
}
