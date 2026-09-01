/**
 * Cloudflare Pages Function: /api/contact
 * Receives admissions & service inquiries, validates data, and sends an email via Resend API
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json();
    const { name, phone, email, programme, message } = body;

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return new Response(JSON.stringify({ success: false, error: 'Full name is required (min 2 characters).' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return new Response(JSON.stringify({ success: false, error: 'A valid email address is required.' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return new Response(JSON.stringify({ success: false, error: 'A valid phone/WhatsApp number is required.' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!programme || typeof programme !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'Please select a programme or service.' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Sanitize string helpers to prevent HTML/header injection
    const sanitize = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .trim();
    };

    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email);
    const cleanPhone = sanitize(phone);
    const cleanProgramme = sanitize(programme);
    const cleanMessage = sanitize(message || 'No additional notes provided.');

    const resendApiKey = env.RESEND_API_KEY;
    const recipientEmail = env.CONTACT_EMAIL_TO || 'ocatechskill@gmail.com';
    const senderEmail = env.CONTACT_EMAIL_FROM || 'OCATECH Inquiries <onboarding@resend.dev>';

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not set in environment variables.');
      // In development / demo mode when key isn't set yet, return success mock so the UI works
      return new Response(JSON.stringify({ 
        success: true, 
        note: 'Submitted in demo mode (configure RESEND_API_KEY in Cloudflare Pages to send live email).' 
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // Build modern HTML email body
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #1e293b; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #071125; padding: 24px; text-align: center; border-bottom: 3px solid #FF6600; }
          .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; }
          .header span { color: #FF0000; }
          .badge { display: inline-block; background: #012D96; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 8px; }
          .content { padding: 28px 24px; }
          .field-row { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
          .field-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 4px; }
          .field-value { font-size: 16px; color: #0f172a; font-weight: 600; }
          .message-box { background: #f8fafc; border-left: 4px solid #012D96; padding: 14px 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #334155; }
          .footer { background: #071125; color: #94a3b8; padding: 16px; text-align: center; font-size: 12px; }
          .btn { display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 700; font-size: 14px; margin-top: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>OCA<span>TECH</span> Inquiries</h1>
            <div class="badge">New Website Application</div>
          </div>
          <div class="content">
            <div class="field-row">
              <div class="field-label">Applicant Name</div>
              <div class="field-value">${cleanName}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Programme / Service Selected</div>
              <div class="field-value" style="color: #012D96;">${cleanProgramme}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Phone / WhatsApp</div>
              <div class="field-value">${cleanPhone}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Email Address</div>
              <div class="field-value"><a href="mailto:${cleanEmail}" style="color: #0055ff;">${cleanEmail}</a></div>
            </div>
            <div class="field-row" style="border-bottom: none;">
              <div class="field-label">Message / Goal</div>
              <div class="message-box">${cleanMessage}</div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}" class="btn">Reply on WhatsApp</a>
            </div>
          </div>
          <div class="footer">
            OCATECH Digital Solutions • 62 New Market Road, Onitsha North, Anambra State
          </div>
        </div>
      </body>
      </html>
    `.trim();

    // Dispatch email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [recipientEmail],
        reply_to: cleanEmail,
        subject: `[OCATECH Application] ${cleanName} - ${cleanProgramme}`,
        html: emailHtml
      })
    });

    if (!resendResponse.ok) {
      const errDetails = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, errDetails);
      return new Response(JSON.stringify({
        success: false,
        error: 'Email delivery failed. Please reach out directly on WhatsApp at 08165321429.'
      }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Contact endpoint error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'An internal error occurred. Please contact us directly via WhatsApp (08165321429).'
    }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
