
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationData {
  name: string;
  email: string;
  phone?: string;
  position: string;
  message: string;
  resume_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, phone, position, message, resume_url }: ApplicationData = await req.json();

    // Input validation
    if (!name || !email || !position || !message) {
      throw new Error("Name, email, position, and message are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please provide a valid email address");
    }

    // Store the application in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from("job_applications")
      .insert({
        name,
        email,
        phone: phone || null,
        position,
        message,
        resume_url: resume_url || null,
        status: "new"
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to submit your application");
    }

    // Send email notification to admin
    // In a production environment, you would integrate with an email service
    console.log(`Job application from ${name} (${email}) for position: ${position}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your application has been submitted successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing job application:", error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to submit application",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
