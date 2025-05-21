import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email: string;
  fullName: string;
  userType: string;
  userGroup?: string;
  phoneNumber?: string;
  icNumber: string;
  password: string;
  createdBy?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key (admin privileges)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if the user has the correct type to create users
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();
    
    if (profileError || !userProfile) {
      return new Response(
        JSON.stringify({ error: "User profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // List of user types allowed to create users
    const allowedUserTypes = [
      'tp_admin', 'tp_hr', 'dusp_admin', 'mcmc_admin', 
      'sso_admin', 'vendor_admin', 'super_admin'
    ];
    
    if (!allowedUserTypes.includes(userProfile.user_type)) {
      return new Response(
        JSON.stringify({ error: "Permission denied. Only admin users can create new users." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const body = await req.text(); // Get raw text first
    
    // Make sure the body is not empty
    if (!body || body.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Request body is empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    let requestData: CreateUserRequest;
    
    try {
      requestData = JSON.parse(body) as CreateUserRequest;
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError, "Raw body:", body);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { email, fullName, userType, userGroup, phoneNumber, icNumber, password, createdBy } = requestData;

    // Validate required fields
    if (!email || !fullName || !userType || !icNumber || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Create the user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: fullName,
        user_type: userType,
        user_group: userGroup,
      }
    });

    if (authError) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: "Failed to create user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert userGroup to number if it's a string
    const userGroupNumber = userGroup ? parseInt(userGroup, 10) : null;

    // 2. Update profiles table with additional data if needed
    // (The trigger should have created the basic profile)
    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({
        phone_number: phoneNumber,
        user_type: userType, // Ensure user_type is set correctly
        user_group: userGroupNumber, // Add user_group as number
        ic_number: icNumber,
      })
      .eq("id", authData.user.id);

    if (profileUpdateError) {
      console.error("Profile update error:", profileUpdateError);
      return new Response(
        JSON.stringify({ error: profileUpdateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Update the users table if needed
    const { error: userUpdateError } = await supabaseAdmin
      .from("users")
      .update({
        phone_number: phoneNumber,
        created_by: createdBy || null,
      })
      .eq("id", authData.user.id);

    if (userUpdateError) {
      console.error("User update error:", userUpdateError);
      return new Response(
        JSON.stringify({ error: userUpdateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("User created successfully:", authData.user.id);

    return new Response(
      JSON.stringify(authData.user),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});