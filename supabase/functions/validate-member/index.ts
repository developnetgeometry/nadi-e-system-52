
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Check API key from request headers (this is for demonstration only)
    const apiKeyHeader = req.headers.get('x-api-key');
    const validApiKey = Deno.env.get("MEMBER_VALIDATION_API_KEY");
    
    if (!apiKeyHeader || apiKeyHeader !== validApiKey) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing API key" }),
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Parse request body
    const requestData = await req.json();
    const { ic_number, email } = requestData;
    
    if (!ic_number && !email) {
      return new Response(
        JSON.stringify({ error: "Either IC number or email is required" }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // This is a mockup validation function
    // In a real-world scenario, you would implement proper validation logic
    // against your database or external system
    
    // Mock response - in reality, you'd check your database
    const isValid = ic_number === "123456789012" || email === "demo@example.com"; 
    
    return new Response(
      JSON.stringify({
        isValid,
        message: isValid 
          ? "Member validated successfully" 
          : "Member not found or invalid credentials"
      }),
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
