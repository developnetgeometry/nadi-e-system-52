
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
    const { email, subject, message, template_id, params } = JSON.parse(body);

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    let title = subject;
    let content = message;

    // If template_id is provided, fetch and use the template
    if (template_id) {
      console.log(`Using template ${template_id} for email notification`);
      
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
      title = template.title_template;
      content = template.message_template;

      // Replace placeholders with provided params
      if (params) {
        Object.keys(params).forEach((key) => {
          const placeholder = `{${key}}`;
          title = title.replace(new RegExp(placeholder, 'g'), params[key]);
          content = content.replace(new RegExp(placeholder, 'g'), params[key]);
        });
      }
    }

    // Get user ID by email
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ 
          error: "No user found with that email", 
          details: userError?.message 
        }),
        { status: 404, headers: corsHeaders }
      );
    }

    // In a real implementation, you would send an actual email here
    console.log(`Test email would be sent to ${email} with subject "${title}"`);
    console.log(`Message: ${content}`);

    // Store a notification record for tracking
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userData.id,
        title: `Email Test: ${title}`,
        message: `Email test sent to ${email}\n\n${content}`,
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
        message: "Test email notification recorded" 
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in send-test-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
