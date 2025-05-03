
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
  image?: File;
}

// Function to send email with resume attachment
async function sendEmailWithResume(data: ApplicationData) {
  try {
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: "jadaunayush3@gmail.com",
          password: "Bharatpur@123",
        },
      },
    });
    
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
            <h1>New Job Application Received</h1>
          </div>
          
          <div class="section">
            <p class="label">Position:</p>
            <p>${data.position}</p>
          </div>
          
          <div class="section">
            <p class="label">Applicant Details:</p>
            <p>Name: ${data.name}</p>
            <p>Email: ${data.email}</p>
            <p>Phone: ${data.phone || 'Not provided'}</p>
          </div>
          
          <div class="section">
            <p class="label">Cover Letter/Message:</p>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email from the SYNJOINT career application system.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const attachments = [];
    
    if (data.resume) {
      const resumeBuffer = await data.resume.arrayBuffer();
      attachments.push({
        filename: data.resume.name,
        content: new Uint8Array(resumeBuffer),
      });
    }
    
    if (data.image) {
      const imageBuffer = await data.image.arrayBuffer();
      attachments.push({
        filename: data.image.name, 
        content: new Uint8Array(imageBuffer),
      });
    }

    await client.send({
      from: "jadaunayush3@gmail.com",
      to: "ayushjadaun03@gmail.com",
      subject: `New Job Application: ${data.position} - ${data.name}`,
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    console.log("Email sent successfully via SMTP");
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
    console.log("Career apply function called");
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    const message = formData.get('message') as string;
    const resume = formData.get('resume') as File || undefined;
    const image = formData.get('image') as File || undefined;

    console.log("Application details:", { name, email, position });

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
    const emailResult = await sendEmailWithResume({ 
      name, 
      email, 
      phone, 
      position, 
      message, 
      resume,
      image
    });
    
    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      // Don't throw error here, just log it
    } else {
      console.log("Email sent successfully to admin");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your application has been submitted successfully",
        emailSent: emailResult.success
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
