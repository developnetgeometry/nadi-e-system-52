import { supabase } from "@/integrations/supabase/client";
import { UserFormData } from "../types";
import { Profile } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

export async function handleCreateUser(data: UserFormData) {
  try {
    // Instead of using the admin API directly, we'll use a server-side function
    // This assumes you have set up a Supabase Edge Function for user creation
    const { data: authData, error: authError } = await supabase.functions.invoke('create-user', {
      body: {
        email: data.email,
        password: data.password || generateTemporaryPassword(),
        user_metadata: { full_name: data.full_name },
      }
    });

    if (authError) throw authError;
    if (!authData?.user) throw new Error("Failed to create user");

    const userId = authData.user.id;

    // Update profile in Supabase
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        user_type: data.user_type as any,
        phone_number: data.phone_number || null,
        ic_number: data.ic_number,
        user_group: data.user_group ? parseInt(data.user_group) : null,
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    // Create type-specific profile based on user_group
    await createUserTypeSpecificProfile(userId, data);

    return { id: userId };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function handleUpdateUser(data: UserFormData, user: Profile) {
  try {
    // Update profile in Supabase
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        user_type: data.user_type as any,
        phone_number: data.phone_number || null,
        ic_number: data.ic_number,
        user_group: data.user_group ? parseInt(data.user_group) : null,
      })
      .eq("id", user.id);

    if (profileError) throw profileError;

    // Update password if provided
    if (data.password && data.password === data.confirm_password) {
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: data.password }
      );

      if (passwordError) throw passwordError;
    }

    // Update type-specific profile based on user_group
    await updateUserTypeSpecificProfile(user.id, data);

    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

async function createUserTypeSpecificProfile(userId: string, data: UserFormData) {
  try {
    const userGroup = data.user_group;
    
    if (!userGroup) return;

    // Find the group info to determine which profile table to use
    const { data: groupInfo } = await supabase
      .from("nd_user_group")
      .select("group_name")
      .eq("id", userGroup)
      .single();

    const groupName = groupInfo?.group_name?.toLowerCase();

    if (groupName?.includes("mcmc")) {
      // Create MCMC profile
      await supabase.from("nd_mcmc_profile").insert({
        user_id: userId,
        fullname: data.full_name,
        ic_no: data.ic_number,
        mobile_no: data.phone_number,
        work_email: data.email,
        position_id: data.position_id ? parseInt(data.position_id) : null,
        is_active: true,
      });
    } else if (groupName?.includes("tp") || groupName?.includes("tech partner")) {
      // Create Tech Partner profile
      const techPartnerInsert = {
        user_id: userId,
        fullname: data.full_name,
        ic_no: data.ic_number,
        mobile_no: data.phone_number,
        work_email: data.email,
        tech_partner_id: data.organization_id ? parseInt(data.organization_id) : null,
        position_id: data.position_id ? parseInt(data.position_id) : null,
        personal_email: data.personal_email || null,
        join_date: data.join_date || null,
        qualification: data.qualification || null,
        dob: data.dob || null,
        place_of_birth: data.place_of_birth || null,
        marital_status: data.marital_status ? parseInt(data.marital_status) : null,
        race_id: data.race_id ? parseInt(data.race_id) : null,
        religion_id: data.religion_id ? parseInt(data.religion_id) : null,
        nationality_id: data.nationality_id ? parseInt(data.nationality_id) : null,
        is_active: true,
      };
      
      await supabase.from("nd_tech_partner_profile").insert(techPartnerInsert);
      
      // For tp_site users, assign them to a specific site
      if (data.user_type === "tp_site" && data.assigned_site_id) {
        await supabase.from("nd_site_user").insert({
          user_id: userId,
          fullname: data.full_name,
          ic_no: data.ic_number,
          mobile_no: data.phone_number,
          work_email: data.email,
          tech_partner_id: data.organization_id ? parseInt(data.organization_id) : null,
          site_profile_id: parseInt(data.assigned_site_id),
          is_active: true,
        });
      }
    } else if (groupName?.includes("dusp")) {
      // Create DUSP profile
      await supabase.from("nd_dusp_profile").insert({
        user_id: userId,
        fullname: data.full_name,
        ic_no: data.ic_number,
        mobile_no: data.phone_number,
        work_email: data.email,
        position_id: data.position_id ? parseInt(data.position_id) : null,
        is_active: true,
      });
    } else if (groupName?.includes("sso")) {
      // Create SSO profile
      await supabase.from("nd_sso_profile").insert({
        user_id: userId,
        fullname: data.full_name,
        ic_no: data.ic_number,
        mobile_no: data.phone_number,
        work_email: data.email,
        position_id: data.position_id ? parseInt(data.position_id) : null,
        is_active: true,
      });
    } else if (groupName?.includes("vendor")) {
      // Create Vendor profile logic here
    }
  } catch (error) {
    console.error("Error creating type-specific profile:", error);
    throw error;
  }
}

async function updateUserTypeSpecificProfile(userId: string, data: UserFormData) {
  try {
    const userGroup = data.user_group;
    
    if (!userGroup) return;

    // Find the group info to determine which profile table to use
    const { data: groupInfo } = await supabase
      .from("nd_user_group")
      .select("group_name")
      .eq("id", userGroup)
      .single();

    const groupName = groupInfo?.group_name?.toLowerCase();

    if (groupName?.includes("mcmc")) {
      // Check if MCMC profile exists
      const { data: existingProfile } = await supabase
        .from("nd_mcmc_profile")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        await supabase.from("nd_mcmc_profile").update({
          fullname: data.full_name,
          ic_no: data.ic_number,
          mobile_no: data.phone_number,
          work_email: data.email,
          position_id: data.position_id ? parseInt(data.position_id) : null,
        }).eq("user_id", userId);
      } else {
        // Create new profile
        await supabase.from("nd_mcmc_profile").insert({
          user_id: userId,
          fullname: data.full_name,
          ic_no: data.ic_number,
          mobile_no: data.phone_number,
          work_email: data.email,
          position_id: data.position_id ? parseInt(data.position_id) : null,
          is_active: true,
        });
      }
    } else if (groupName?.includes("tp") || groupName?.includes("tech partner")) {
      // Check if TP profile exists
      const { data: existingProfile } = await supabase
        .from("nd_tech_partner_profile")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      const tpProfileData = {
        fullname: data.full_name,
        ic_no: data.ic_number,
        mobile_no: data.phone_number,
        work_email: data.email,
        tech_partner_id: data.organization_id ? parseInt(data.organization_id) : null,
        position_id: data.position_id ? parseInt(data.position_id) : null,
        personal_email: data.personal_email || null,
        join_date: data.join_date || null,
        qualification: data.qualification || null,
        dob: data.dob || null,
        place_of_birth: data.place_of_birth || null,
        marital_status: data.marital_status ? parseInt(data.marital_status) : null,
        race_id: data.race_id ? parseInt(data.race_id) : null,
        religion_id: data.religion_id ? parseInt(data.religion_id) : null,
        nationality_id: data.nationality_id ? parseInt(data.nationality_id) : null,
      };

      if (existingProfile) {
        // Update existing profile
        await supabase
          .from("nd_tech_partner_profile")
          .update(tpProfileData)
          .eq("user_id", userId);
      } else {
        // Create new profile
        await supabase.from("nd_tech_partner_profile").insert({
          ...tpProfileData,
          user_id: userId,
          is_active: true,
        });
      }
      
      // For tp_site users, update or create site assignment
      if (data.user_type === "tp_site" && data.assigned_site_id) {
        // Check if site user exists
        const { data: existingSiteUser } = await supabase
          .from("nd_site_user")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
          
        const siteUserData = {
          fullname: data.full_name,
          ic_no: data.ic_number,
          mobile_no: data.phone_number,
          work_email: data.email,
          tech_partner_id: data.organization_id ? parseInt(data.organization_id) : null,
          site_profile_id: parseInt(data.assigned_site_id),
        };
        
        if (existingSiteUser) {
          // Update existing site user
          await supabase
            .from("nd_site_user")
            .update(siteUserData)
            .eq("user_id", userId);
        } else {
          // Create new site user
          await supabase.from("nd_site_user").insert({
            ...siteUserData,
            user_id: userId,
            is_active: true,
          });
        }
      }
    } else if (groupName?.includes("dusp")) {
      // Update DUSP profile
      const { data: existingProfile } = await supabase
        .from("nd_dusp_profile")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingProfile) {
        await supabase.from("nd_dusp_profile").update({
          fullname: data.full_name,
          ic_no: data.ic_number,
          mobile_no: data.phone_number,
          work_email: data.email,
          position_id: data.position_id ? parseInt(data.position_id) : null,
        }).eq("user_id", userId);
      } else {
        await supabase.from("nd_dusp_profile").insert({
          user_id: userId,
          fullname: data.full_name,
          ic_no: data.ic_number,
          mobile_no: data.phone_number,
          work_email: data.email,
          position_id: data.position_id ? parseInt(data.position_id) : null,
          is_active: true,
        });
      }
    } else if (groupName?.includes("sso")) {
      // Update SSO profile
      const { data: existingProfile } = await supabase
        .from("nd_sso_profile")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingProfile) {
        await supabase.from("nd_sso_profile").update({
          fullname: data.full_name,
          ic_no: data.ic_number,
          mobile_no: data.phone_number,
          work_email: data.email,
          position_id: data.position_id ? parseInt(data.position_id) : null,
        }).eq("user_id", userId);
      } else {
        await supabase.from("nd_sso_profile").insert({
          user_id: userId,
          fullname: data.full_name,
          ic_no: data.ic_number,
          mobile_no: data.phone_number,
          work_email: data.email,
          position_id: data.position_id ? parseInt(data.position_id) : null,
          is_active: true,
        });
      }
    } else if (groupName?.includes("vendor")) {
      // Update Vendor profile logic here
    }
  } catch (error) {
    console.error("Error updating type-specific profile:", error);
    throw error;
  }
}

function generateTemporaryPassword() {
  // Simple random password generator
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
