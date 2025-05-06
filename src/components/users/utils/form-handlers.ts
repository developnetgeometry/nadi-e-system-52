
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
      gender: data.gender,
      work_email: data.work_email,
    })
    .eq("id", userData.user.id);

  if (profileError) throw profileError;
  
  // Handle user-specific profile tables based on user_group
  if (data.user_group) {
    const userGroupId = parseInt(data.user_group);
    const { data: groupData } = await supabase
      .from("nd_user_group")
      .select("group_name")
      .eq("id", userGroupId)
      .single();
      
    if (groupData?.group_name) {
      const groupName = groupData.group_name.toLowerCase();
      
      // For MCMC users
      if (groupName.includes("mcmc")) {
        const { error: mcmcError } = await supabase
          .from("nd_mcmc_profile")
          .insert({
            user_id: userData.user.id,
            fullname: data.full_name,
            ic_no: data.ic_number,
            mobile_no: data.phone_number,
            work_email: data.work_email,
            position_id: data.position_id ? parseInt(data.position_id) : null,
            is_active: true,
          });
        
        if (mcmcError) throw mcmcError;
      }
      
      // For TP (Technology Partner) users
      else if (groupName.includes("tp") || groupName.includes("tech partner")) {
        const { error: tpError } = await supabase
          .from("nd_tech_partner_profile")
          .insert({
            user_id: userData.user.id,
            fullname: data.full_name,
            ic_no: data.ic_number,
            mobile_no: data.phone_number,
            work_email: data.work_email,
            position_id: data.position_id ? parseInt(data.position_id) : null,
            tech_partner_id: data.tech_partner_id ? parseInt(data.tech_partner_id) : null,
            is_active: true,
          });
        
        if (tpError) throw tpError;
      }
      
      // For DUSP users
      else if (groupName.includes("dusp")) {
        const { error: duspError } = await supabase
          .from("nd_dusp_profile")
          .insert({
            user_id: userData.user.id,
            fullname: data.full_name,
            ic_no: data.ic_number,
            mobile_no: data.phone_number,
            work_email: data.work_email,
            position_id: data.position_id ? parseInt(data.position_id) : null,
            is_active: true,
          });
        
        if (duspError) throw duspError;
      }
      
      // For SSO users
      else if (groupName.includes("sso")) {
        const { error: ssoError } = await supabase
          .from("nd_sso_profile")
          .insert({
            user_id: userData.user.id,
            fullname: data.full_name,
            ic_no: data.ic_number,
            mobile_no: data.phone_number,
            work_email: data.work_email,
            position_id: data.position_id ? parseInt(data.position_id) : null,
            is_active: true,
          });
        
        if (ssoError) throw ssoError;
      }
    }
  }
  
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
      gender: data.gender,
      work_email: data.work_email,
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
  
  // Check if user has MCMC profile
  const { data: mcmcProfile } = await supabase
    .from("nd_mcmc_profile")
    .select("id")
    .eq("user_id", user.id)
    .single();
    
  // Check if user has TP profile
  const { data: tpProfile } = await supabase
    .from("nd_tech_partner_profile")
    .select("id")
    .eq("user_id", user.id)
    .single();
    
  // Check if user has DUSP profile
  const { data: duspProfile } = await supabase
    .from("nd_dusp_profile")
    .select("id")
    .eq("user_id", user.id)
    .single();
    
  // Check if user has SSO profile
  const { data: ssoProfile } = await supabase
    .from("nd_sso_profile")
    .select("id")
    .eq("user_id", user.id)
    .single();
  
  // Handle user-specific profile tables based on user_group
  if (data.user_group) {
    const userGroupId = parseInt(data.user_group);
    const { data: groupData } = await supabase
      .from("nd_user_group")
      .select("group_name")
      .eq("id", userGroupId)
      .single();
      
    if (groupData?.group_name) {
      const groupName = groupData.group_name.toLowerCase();
      
      // For MCMC users
      if (groupName.includes("mcmc")) {
        if (mcmcProfile) {
          // Update existing MCMC profile
          const { error: mcmcError } = await supabase
            .from("nd_mcmc_profile")
            .update({
              fullname: data.full_name,
              ic_no: data.ic_number,
              mobile_no: data.phone_number,
              work_email: data.work_email,
              position_id: data.position_id ? parseInt(data.position_id) : null,
            })
            .eq("user_id", user.id);
          
          if (mcmcError) throw mcmcError;
        } else {
          // Create new MCMC profile
          const { error: mcmcError } = await supabase
            .from("nd_mcmc_profile")
            .insert({
              user_id: user.id,
              fullname: data.full_name,
              ic_no: data.ic_number,
              mobile_no: data.phone_number,
              work_email: data.work_email,
              position_id: data.position_id ? parseInt(data.position_id) : null,
              is_active: true,
            });
          
          if (mcmcError) throw mcmcError;
        }
        
        // Deactivate other profiles
        if (tpProfile) {
          await supabase
            .from("nd_tech_partner_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        if (duspProfile) {
          await supabase
            .from("nd_dusp_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        if (ssoProfile) {
          await supabase
            .from("nd_sso_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
      }
      
      // For TP (Technology Partner) users
      else if (groupName.includes("tp") || groupName.includes("tech partner")) {
        if (tpProfile) {
          // Update existing TP profile
          const { error: tpError } = await supabase
            .from("nd_tech_partner_profile")
            .update({
              fullname: data.full_name,
              ic_no: data.ic_number,
              mobile_no: data.phone_number,
              work_email: data.work_email,
              position_id: data.position_id ? parseInt(data.position_id) : null,
              tech_partner_id: data.tech_partner_id ? parseInt(data.tech_partner_id) : null,
            })
            .eq("user_id", user.id);
          
          if (tpError) throw tpError;
        } else {
          // Create new TP profile
          const { error: tpError } = await supabase
            .from("nd_tech_partner_profile")
            .insert({
              user_id: user.id,
              fullname: data.full_name,
              ic_no: data.ic_number,
              mobile_no: data.phone_number,
              work_email: data.work_email,
              position_id: data.position_id ? parseInt(data.position_id) : null,
              tech_partner_id: data.tech_partner_id ? parseInt(data.tech_partner_id) : null,
              is_active: true,
            });
          
          if (tpError) throw tpError;
        }
        
        // Deactivate other profiles
        if (mcmcProfile) {
          await supabase
            .from("nd_mcmc_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        if (duspProfile) {
          await supabase
            .from("nd_dusp_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        if (ssoProfile) {
          await supabase
            .from("nd_sso_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
      }
      
      // For DUSP users
      else if (groupName.includes("dusp")) {
        if (duspProfile) {
          // Update existing DUSP profile
          const { error: duspError } = await supabase
            .from("nd_dusp_profile")
            .update({
              fullname: data.full_name,
              ic_no: data.ic_number,
              mobile_no: data.phone_number,
              work_email: data.work_email,
              position_id: data.position_id ? parseInt(data.position_id) : null,
            })
            .eq("user_id", user.id);
          
          if (duspError) throw duspError;
        } else {
          // Create new DUSP profile
          const { error: duspError } = await supabase
            .from("nd_dusp_profile")
            .insert({
              user_id: user.id,
              fullname: data.full_name,
              ic_no: data.ic_number,
              mobile_no: data.phone_number,
              work_email: data.work_email,
              position_id: data.position_id ? parseInt(data.position_id) : null,
              is_active: true,
            });
          
          if (duspError) throw duspError;
        }
        
        // Deactivate other profiles
        if (mcmcProfile) {
          await supabase
            .from("nd_mcmc_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        if (tpProfile) {
          await supabase
            .from("nd_tech_partner_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        if (ssoProfile) {
          await supabase
            .from("nd_sso_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
      }
      
      // For SSO users
      else if (groupName.includes("sso")) {
        if (ssoProfile) {
          // Update existing SSO profile
          const { error: ssoError } = await supabase
            .from("nd_sso_profile")
            .update({
              fullname: data.full_name,
              ic_no: data.ic_number,
              mobile_no: data.phone_number,
              work_email: data.work_email,
              position_id: data.position_id ? parseInt(data.position_id) : null,
            })
            .eq("user_id", user.id);
          
          if (ssoError) throw ssoError;
        } else {
          // Create new SSO profile
          const { error: ssoError } = await supabase
            .from("nd_sso_profile")
            .insert({
              user_id: user.id,
              fullname: data.full_name,
              ic_no: data.ic_number,
              mobile_no: data.phone_number,
              work_email: data.work_email,
              position_id: data.position_id ? parseInt(data.position_id) : null,
              is_active: true,
            });
          
          if (ssoError) throw ssoError;
        }
        
        // Deactivate other profiles
        if (mcmcProfile) {
          await supabase
            .from("nd_mcmc_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        if (tpProfile) {
          await supabase
            .from("nd_tech_partner_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        if (duspProfile) {
          await supabase
            .from("nd_dusp_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
      }
      else {
        // For other user groups, deactivate all specific profiles if they exist
        if (mcmcProfile) {
          await supabase
            .from("nd_mcmc_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        
        if (tpProfile) {
          await supabase
            .from("nd_tech_partner_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        
        if (duspProfile) {
          await supabase
            .from("nd_dusp_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
        
        if (ssoProfile) {
          await supabase
            .from("nd_sso_profile")
            .update({ is_active: false })
            .eq("user_id", user.id);
        }
      }
    }
  }

  return user;
}
