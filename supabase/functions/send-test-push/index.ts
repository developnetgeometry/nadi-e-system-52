
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
    const { userId, title, body: messageBody } = JSON.parse(body);

    if (!userId || !title || !messageBody) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // In a real implementation, you would send an actual push notification here
    // For now, we'll log the attempt and store a notification record
    console.log(`Test push notification would be sent to user ${userId}`);
    console.log(`Title: ${title}, Body: ${messageBody}`);

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
        title: `Push Test: ${title}`,
        message: messageBody,
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
