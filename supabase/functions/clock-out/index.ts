
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Define the expected request body type
interface ClockOutRequest {
  staff_id: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  photo_path?: string;
  updated_by: string;
}

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

    if (!body || body.trim() === "") {
      return new Response(JSON.stringify({ error: "Request body is empty" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    let payload: ClockOutRequest;

    try {
      payload = JSON.parse(body);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { staff_id, latitude, longitude, address, photo_path, updated_by } =
      payload;

    if (!staff_id || !updated_by) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    // 1. Find today's attendance record
    const { data: attendanceRecord, error: findError } = await supabase
      .from("nd_staff_attendance")
      .select("*")
      .eq("staff_id", staff_id)
      .eq("attend_date", today)
      .maybeSingle();

    if (!attendanceRecord || findError) {
      return new Response(
        JSON.stringify({ error: "No clock-in record found for today" }),
        { status: 404, headers: corsHeaders }
      );
    }

    if (attendanceRecord.check_out) {
      return new Response(
        JSON.stringify({ error: "Staff has already clocked out today" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Calculate total working hours
    const checkInTime = new Date(attendanceRecord.check_in);
    const checkOutTime = new Date();
    const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    // 2. Update the record with clock-out information
    const updateData: any = {
      check_out: checkOutTime.toISOString(),
      total_working_hour: parseFloat(totalHours.toFixed(2)),
      updated_by,
      updated_at: checkOutTime.toISOString(),
    };

    if (latitude) updateData.latitude = latitude;
    if (longitude) {
      updateData.longitude = longitude;
      updateData.longtitude = longitude; // Support typo column
    }
    if (address) updateData.address = address;
    if (photo_path) updateData.photo_path = photo_path;

    const { error: updateError } = await supabase
      .from("nd_staff_attendance")
      .update(updateData)
      .eq("id", attendanceRecord.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({
          error: "Failed to clock out",
          details: updateError.message,
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Clock-out successful",
        total_hours: parseFloat(totalHours.toFixed(2)),
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unexpected server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
