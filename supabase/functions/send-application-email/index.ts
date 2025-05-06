
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
    
    // Get admin email from form data or use default
    const adminEmail = formData.get('admin_email') as string || 'jadaunayush3@gmail.com';
    
    // Check if we should send a copy to the applicant
    const sendApplicantCopy = formData.get('send_applicant_copy') === 'true';
    
    // Get files
    const resume = formData.get('resume') as File;
    const image = formData.get('image') as File;

    console.log("Received application form:", { name, email, position, adminEmail });
    console.log("Resume file present:", !!resume);
    console.log("Image file present:", !!image);
    console.log("Send copy to applicant:", sendApplicantCopy);

    // Create Nodemailer transporter using app password for Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: "jadaunayush3@gmail.com",
        // Using the App Password provided by the user
        pass: "ninp movv pyvw gyoq", 
      },
    });
    
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
    
    // Admin email HTML template
    const adminEmailHtml = `
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
    
    // Applicant confirmation email HTML template
    const applicantEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #006B9F; color: white; padding: 10px 20px; border-radius: 5px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .footer { font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Confirmation</h1>
          </div>
          
          <div class="section">
            <p>Dear ${name},</p>
            <p>Thank you for applying for the <strong>${position}</strong> position at Synjoint.</p>
            <p>We have received your application and will review it soon. If your qualifications match our requirements, we will contact you for the next steps.</p>
          </div>
          
          <div class="section">
            <p>Application Details:</p>
            <p><strong>Position:</strong> ${position}</p>
            <p><strong>Submitted on:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated confirmation from the SYNJOINT career application system.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("Sending admin email to:", adminEmail);
    
    // Send admin notification email
    const adminInfo = await transporter.sendMail({
      from: '"Synjoint Careers" <jadaunayush3@gmail.com>',
      to: adminEmail,
      subject: `New Job Application: ${position} - ${name}`,
      html: adminEmailHtml,
      attachments: attachments
    });

    console.log("Admin email sent successfully:", adminInfo.messageId);
    
    // Send applicant confirmation email if requested
    if (sendApplicantCopy && email) {
      console.log("Sending confirmation email to applicant:", email);
      
      const applicantInfo = await transporter.sendMail({
        from: '"Synjoint Careers" <jadaunayush3@gmail.com>',
        to: email,
        subject: `Your Application for ${position} at Synjoint`,
        html: applicantEmailHtml
      });
      
      console.log("Applicant confirmation email sent successfully:", applicantInfo.messageId);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: adminInfo.messageId 
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
