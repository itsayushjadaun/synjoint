
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get form data from request
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string || 'Not provided';
    const position = formData.get('position') as string;
    const message = formData.get('message') as string;
    const recipientEmail = formData.get('recipientEmail') as string || 'ayushjadaun03@gmail.com';
    
    // Get files
    const resume = formData.get('resume') as File;
    const image = formData.get('image') as File;

    // Prepare attachments if files exist
    const attachments = [];
    
    if (resume) {
      const resumeArrayBuffer = await resume.arrayBuffer();
      const resumeUint8Array = new Uint8Array(resumeArrayBuffer);
      
      attachments.push({
        filename: resume.name,
        content: resumeUint8Array,
        contentType: resume.type
      });
    }
    
    if (image) {
      const imageArrayBuffer = await image.arrayBuffer();
      const imageUint8Array = new Uint8Array(imageArrayBuffer);
      
      attachments.push({
        filename: image.name,
        content: imageUint8Array,
        contentType: image.type
      });
    }

    // Connect to SMTP server
    const client = new SmtpClient();
    
    await client.connectTLS({
      hostname: Deno.env.get("SMTP_HOST") || "smtp.gmail.com",
      port: Number(Deno.env.get("SMTP_PORT")) || 465,
      username: Deno.env.get("SMTP_USERNAME") || "",
      password: Deno.env.get("SMTP_PASSWORD") || ""
    });
    
    // Send email
    const sendOptions = {
      from: Deno.env.get("SMTP_FROM") || "noreply@synjoint.com",
      to: recipientEmail,
      subject: `New Job Application: ${position}`,
      content: `
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
      <p>${position}</p>
    </div>
    
    <div class="section">
      <p class="label">Applicant Details:</p>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
    </div>
    
    <div class="section">
      <p class="label">Cover Letter/Message:</p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
    
    <div class="footer">
      <p>This is an automated email from the SYNJOINT career application system.</p>
    </div>
  </div>
</body>
</html>
      `,
      html: true,
      attachments: attachments
    };
    
    await client.send(sendOptions);
    await client.close();

    console.log("Application email sent successfully");
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error in send-application-email function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});
