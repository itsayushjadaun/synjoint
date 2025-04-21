
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

// Function to send WhatsApp message
async function sendWhatsAppMessage(message: string) {
  try {
    const phone = "918824405590"; // Phone number in international format without +
    const encodedMessage = encodeURIComponent(message);
    
    // Log the WhatsApp message for debugging
    console.log(`Preparing WhatsApp message to ${phone}: ${message}`);
    
    // For edge function, we can't directly open a browser window
    // Instead, we'll create the URL that will be used client-side
    return {
      whatsappUrl: `https://wa.me/${phone}?text=${encodedMessage}`,
      success: true
    };
  } catch (error) {
    console.error("Error preparing WhatsApp message:", error);
    return { success: false, error: error.message };
  }
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

    // Prepare WhatsApp message
    const waMsg = `New job application from ${name}\nPosition: ${position}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nMessage: ${message}\nResume: ${resume_url || 'Not provided'}`;
    const whatsappResult = await sendWhatsAppMessage(waMsg);

    // Send email notification to admin
    // For now, we'll just log it. Later, you can integrate an email service
    console.log(`Job application email would be sent to synjoint.tech@gmail.com`);
    console.log(`From: ${name} (${email}) for position: ${position}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your application has been submitted successfully",
        whatsapp: whatsappResult
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
