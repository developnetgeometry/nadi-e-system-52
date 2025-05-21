
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BackupRequest {
  includeTables?: string[];
  includeSchema?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
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
    
    // Check if the user is a super admin
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
    
    if (userProfile.user_type !== 'super_admin') {
      return new Response(
        JSON.stringify({ error: "Only super admins can request database backups" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    let requestData: BackupRequest = {};
    if (req.method === "POST") {
      try {
        const body = await req.text();
        if (body && body.trim() !== "") {
          requestData = JSON.parse(body);
        }
      } catch (e) {
        console.error("Error parsing request body:", e);
      }
    }

    // Create a backup request record
    const timestamp = new Date().toISOString();
    const filename = `backup_${timestamp.replace(/[:.]/g, "-")}.sql`;
    
    const { data: backupRequest, error: backupRequestError } = await supabaseAdmin
      .from("backup_requests")
      .insert({
        requested_by: user.id,
        status: "pending",
        include_schema: requestData.includeSchema !== false, // Default to true
        tables: requestData.includeTables || null,
      })
      .select()
      .single();
    
    if (backupRequestError) {
      return new Response(
        JSON.stringify({ error: "Failed to create backup request", details: backupRequestError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // In a real implementation, you would trigger the actual backup process here
    // For this example, we'll just update the status to show it was requested
    
    // Create a signed URL for future download
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
      .storage
      .from('database_backups')
      .createSignedUrl(`backups/${filename}`, 60 * 60); // 1 hour expiry
    
    if (signedUrlError) {
      console.error("Error creating signed URL:", signedUrlError);
    } else {
      // Update the backup request with the signed URL
      await supabaseAdmin
        .from("backup_requests")
        .update({
          download_url: signedUrlData.signedUrl,
          file_path: `backups/${filename}`
        })
        .eq("id", backupRequest.id);
    }

    return new Response(
      JSON.stringify({
        message: "Backup request created",
        backupId: backupRequest.id,
        status: "pending",
        downloadUrl: signedUrlData?.signedUrl
      }),
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
