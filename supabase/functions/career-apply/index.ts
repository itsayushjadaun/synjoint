
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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
  resume?: File;
}

// Function to send WhatsApp message
async function sendWhatsAppMessage(message: string) {
  try {
    const phone = "918824405590";
    const encodedMessage = encodeURIComponent(message);
    
    console.log(`Preparing WhatsApp message to ${phone}: ${message}`);
    
    return {
      whatsappUrl: `https://wa.me/${phone}?text=${encodedMessage}`,
      success: true
    };
  } catch (error) {
    console.error("Error preparing WhatsApp message:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Function to send email with resume attachment
async function sendEmailWithResume(data: ApplicationData) {
  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const emailHtml = `
      <h1>New Job Application</h1>
      <p><strong>Position:</strong> ${data.position}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Synjoint Careers <careers@synjoint.com>",
      to: "synjoint.tech@gmail.com",
      subject: `New Job Application: ${data.position} - ${data.name}`,
      html: emailHtml,
      attachments: data.resume ? [{
        filename: data.resume.name,
        content: await data.resume.arrayBuffer()
      }] : undefined
    });

    console.log("Email sent successfully:", emailResponse);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    const message = formData.get('message') as string;
    const resume = formData.get('resume') as File || undefined;

    if (!name || !email || !position || !message) {
      throw new Error("Name, email, position, and message are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please provide a valid email address");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store application details in database (without resume)
    const { error: dbError } = await supabase
      .from("job_applications")
      .insert({
        name,
        email,
        phone: phone || null,
        position,
        message,
        status: "new"
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to submit your application");
    }

    // Send email with resume attachment
    const emailResult = await sendEmailWithResume({ name, email, phone, position, message, resume });
    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
    }

    // Prepare WhatsApp message
    const waMsg = `New job application from ${name}\nPosition: ${position}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nMessage: ${message}`;
    const whatsappResult = await sendWhatsAppMessage(waMsg);

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
