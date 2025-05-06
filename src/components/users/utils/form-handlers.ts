
import { supabase } from "@/lib/supabase";
import { UserFormData } from "../types";
import { Profile } from "@/types/auth";

export async function handleCreateUser(data: UserFormData) {
  // First create the auth user
  const { data: userData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password || "",
    options: {
      data: {
        full_name: data.full_name,
      },
    },
  });

  if (signUpError) throw signUpError;
  if (!userData.user) throw new Error("Failed to create user");

  // Then update the profile with additional fields
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone_number: data.phone_number,
      ic_number: data.ic_number,
      user_type: data.user_type,
      user_group: data.user_group ? parseInt(data.user_group) : null,
      gender: data.gender, // Added gender field
    })
    .eq("id", userData.user.id);

  if (profileError) throw profileError;
  return userData;
}

export async function handleUpdateUser(data: UserFormData, user: Profile) {
  // Update the profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone_number: data.phone_number,
      ic_number: data.ic_number,
      user_type: data.user_type,
      user_group: data.user_group ? parseInt(data.user_group) : null,
      gender: data.gender, // Added gender field
    })
    .eq("id", user.id);

  if (updateError) throw updateError;

  // Update password if provided
  if (data.password) {
    const { error: passwordError } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (passwordError) throw passwordError;
  }

  return user;
}
