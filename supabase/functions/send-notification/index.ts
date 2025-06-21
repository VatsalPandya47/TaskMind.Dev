
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'waitlist' | 'demo';
  name?: string;
  email: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, name, email, source }: NotificationRequest = await req.json();

    let adminSubject = '';
    let adminContent = '';
    let userSubject = '';
    let userContent = '';

    if (type === 'waitlist') {
      // Admin notification
      adminSubject = '🎉 New Waitlist Signup - TaskMind';
      adminContent = `
        <h2>New Waitlist Signup!</h2>
        <p><strong>Email:</strong> ${email}</p>
        ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
        ${source ? `<p><strong>Source:</strong> ${source}</p>` : ''}
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `;

      // User welcome email
      userSubject = '🎉 Welcome to TaskMind - You\'re on the waitlist!';
      userContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #000; font-size: 28px; margin-bottom: 20px; text-align: center;">🎉 Welcome to TaskMind!</h1>
            
            ${name ? `<p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi ${name},</p>` : '<p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi there,</p>'}
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              <strong>Thank you for joining the TaskMind waitlist!</strong> We're absolutely thrilled to have you on board and can't wait to share something incredible with you.
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              TaskMind is going to revolutionize how you manage tasks and boost your productivity with AI-powered automation. You're among the first to experience the future of task management!
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #000; margin-bottom: 15px;">🚀 What to expect:</h3>
              <ul style="color: #555; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Early access to TaskMind's beta version</li>
                <li>Exclusive updates on our development progress</li>
                <li>Special launch pricing when we go live</li>
                <li>Direct input on features you'd love to see</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              We're working around the clock to bring TaskMind to life, and we'll keep you updated every step of the way. Get ready to transform your productivity!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 18px; color: #000; font-weight: bold;">🎯 Get ready to achieve more with TaskMind!</p>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px; text-align: center;">
              Best regards,<br>
              <strong>The TaskMind Team</strong>
            </p>
          </div>
          
          <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
            You received this email because you signed up for the TaskMind waitlist. We're excited to have you!
          </p>
        </div>
      `;
    } else if (type === 'demo') {
      // Admin notification
      adminSubject = '📞 New Demo Request - TaskMind';
      adminContent = `
        <h2>New Demo Request!</h2>
        <p><strong>Email:</strong> ${email}</p>
        ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `;
    }

    // Send admin notification
    const emailResponse = await resend.emails.send({
      from: "TaskMind Notifications <onboarding@resend.dev>",
      to: ["vatsalpandya@taskmind.dev"],
      subject: adminSubject,
      html: adminContent,
    });

    console.log("Admin notification email sent successfully:", emailResponse);

    // Send user welcome email if it's a waitlist signup
    if (type === 'waitlist') {
      const userEmailResponse = await resend.emails.send({
        from: "TaskMind Team <onboarding@resend.dev>",
        to: [email],
        subject: userSubject,
        html: userContent,
      });

      console.log("User welcome email sent successfully:", userEmailResponse);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
