
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer";

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

    // Store the message directly in the contacts table - not using contact_messages
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert into contacts table 
    const { error: dbError } = await supabase
      .from("contacts")
      .insert({
        name,
        email,
        message,
        // phone field doesn't exist in contacts table so we don't include it
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save your message");
    }

    // Send email notification to the admin
    // Create Nodemailer transporter using app password for Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: "jadaunayush3@gmail.com",
        pass: "ninp movv pyvw gyoq", // Using the App Password provided by the user
      },
    });

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #006B9F; color: white; padding: 10px 20px; border-radius: 5px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; }
          .footer { font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          
          <div class="section">
            <p class="label">Contact Details:</p>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone || 'Not provided'}</p>
          </div>
          
          <div class="section">
            <p class="label">Message:</p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email from the SYNJOINT contact form system.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("Sending contact form email to:", "jadaunayush3@gmail.com");

    const info = await transporter.sendMail({
      from: '"Synjoint Contact" <jadaunayush3@gmail.com>',
      to: "jadaunayush3@gmail.com", // Fixed recipient email
      subject: `New Contact Form Submission - ${name}`,
      html: emailHtml,
    });

    console.log("Contact form email sent successfully:", info.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been sent successfully",
        emailSent: true,
        messageId: info.messageId
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
