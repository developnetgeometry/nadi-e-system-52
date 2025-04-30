
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.text();
    const { userId, title, body: messageBody, template_id, params } = JSON.parse(body);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    let notificationTitle = title || "Test Notification";
    let notificationBody = messageBody || "This is a test push notification";

    // If template_id is provided, fetch and use the template
    if (template_id) {
      console.log(`Using template ${template_id} for push notification`);
      
      // Get the template
      const { data: template, error: templateError } = await supabase
        .from("notification_templates")
        .select("*")
        .eq("id", template_id)
        .single();

      if (templateError) {
        return new Response(
          JSON.stringify({ 
            error: "Failed to retrieve template", 
            details: templateError.message 
          }),
          { status: 404, headers: corsHeaders }
        );
      }

      // Process template with params
      notificationTitle = template.title_template;
      notificationBody = template.message_template;

      // Replace placeholders with provided params
      if (params) {
        Object.keys(params).forEach((key) => {
          const placeholder = `{${key}}`;
          notificationTitle = notificationTitle.replace(new RegExp(placeholder, 'g'), params[key]);
          notificationBody = notificationBody.replace(new RegExp(placeholder, 'g'), params[key]);
        });
      }
    }

    // In a real implementation, you would send an actual push notification here
    console.log(`Test push notification would be sent to user ${userId}`);
    console.log(`Title: ${notificationTitle}, Body: ${notificationBody}`);

    // Verify user exists
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ 
          error: "No user found with that ID", 
          details: userError?.message 
        }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Store a notification record for tracking
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title: `Push Test: ${notificationTitle}`,
        message: notificationBody,
        type: "info",
        read: false
      });

    if (notificationError) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to create notification record", 
          details: notificationError.message 
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Test push notification recorded" 
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in send-test-push function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
