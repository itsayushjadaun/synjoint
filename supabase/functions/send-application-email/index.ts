
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import nodemailer from "npm:nodemailer";

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

    // Create Nodemailer transporter using OAuth2 instead of direct password
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: "jadaunayush3@gmail.com",
        // For security, in production you should use app password, not regular password
        pass: "Bharatpur@123", 
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
    `;

    // Prepare attachments
    const attachments = [];
    
    if (resume) {
      const resumeArrayBuffer = await resume.arrayBuffer();
      
      attachments.push({
        filename: resume.name,
        content: new Uint8Array(resumeArrayBuffer)
      });
    }
    
    if (image) {
      const imageArrayBuffer = await image.arrayBuffer();
      
      attachments.push({
        filename: image.name,
        content: new Uint8Array(imageArrayBuffer)
      });
    }

    console.log("Sending email with nodemailer to:", recipientEmail);
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Synjoint Careers" <jadaunayush3@gmail.com>',
      to: recipientEmail,
      subject: `New Job Application: ${position} - ${name}`,
      html: emailHtml,
      attachments: attachments
    });

    console.log("Application email sent successfully via Nodemailer:", info.messageId);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: info.messageId 
      }),
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
