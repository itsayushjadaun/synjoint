
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, phone, message }: ContactFormData = await req.json();

    // Input validation
    if (!name || !email || !message) {
      throw new Error("Name, email, and message are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please provide a valid email address");
    }

    // Store the message in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        phone: phone || null,
        message,
        status: "new"
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save your message");
    }

    // Send email notification to admin
    // In a production environment, you would integrate with an email service
    // like Resend.com, SendGrid, etc.
    console.log(`Contact form submission from ${name} (${email}): ${message}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been sent successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to send message",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
