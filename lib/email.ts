import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_PASS!,
  },
});

interface EmailOptions {
  to:      string;
  subject: string;
  html:    string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"LogoVines" <${process.env.GMAIL_USER}>`,
      to, subject, html,
      headers: {
        "X-Priority": "3",
        "X-Mailer": "LogoVines Mailer",
        "X-MSMail-Priority": "Normal",
        "Importance": "Normal",
      },
    });
    console.log("[EMAIL] Sent to:", to);
  } catch (error) {
    console.error("[EMAIL ERROR]:", error);
  }
}

// Shared header/footer
const header = `
<tr><td style="background:#1A4450;padding:28px 32px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:4px;text-transform:uppercase;">LOGO VINES</h1>
  <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Graphic Design Studio</p>
</td></tr>`;

const footer = (year: number) => `
<tr><td style="padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;background:#f9fafb;">
  <p style="margin:0;color:#9ca3af;font-size:11px;">© ${year} LogoVines · You're receiving this because you have an account with us.</p>
</td></tr>`;

const wrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">
        ${header}
        ${content}
        ${footer(new Date().getFullYear())}
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Email Templates ──────────────────────────────────────

export function emailApproved(name: string, logoTitle: string, logoId: string) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/logo/${logoId}`;
  return {
    subject: `Your logo "${logoTitle}" has been approved!`,
    html: wrapper(`
      <tr><td style="background:#f0fdf4;padding:14px 32px;text-align:center;border-bottom:1px solid #bbf7d0;">
        <p style="margin:0;color:#16a34a;font-size:14px;font-weight:700;">Logo Approved & Now Live!</p>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="color:#374151;font-size:15px;margin:0 0 12px;">Hi <strong style="color:#1A4450;">${name}</strong>,</p>
        <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 24px;">
          Your logo <strong style="color:#1A4450;">"${logoTitle}"</strong> has been approved and is now live on LogoVines.
        </p>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px 20px;margin:0 0 28px;">
          <p style="margin:0;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Logo</p>
          <p style="margin:6px 0 0;color:#1A4450;font-size:15px;font-weight:600;">${logoTitle}</p>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="${url}" style="display:inline-block;background:#1A4450;color:#fff;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 36px;border-radius:8px;text-decoration:none;">
            View Your Logo →
          </a>
        </div>
        <p style="color:#9ca3af;font-size:13px;line-height:1.7;margin:0;">Keep uploading great designs!</p>
      </td></tr>
    `),
  };
}

export function emailRejected(name: string, logoTitle: string) {
  return {
    subject: `Your logo "${logoTitle}" was not approved`,
    html: wrapper(`
      <tr><td style="background:#fef2f2;padding:14px 32px;text-align:center;border-bottom:1px solid #fecaca;">
        <p style="margin:0;color:#dc2626;font-size:14px;font-weight:700;">Logo Not Approved</p>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="color:#374151;font-size:15px;margin:0 0 12px;">Hi <strong style="color:#1A4450;">${name}</strong>,</p>
        <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 24px;">
          Unfortunately, your logo <strong style="color:#1A4450;">"${logoTitle}"</strong> did not meet our quality guidelines.
        </p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px 24px;margin:0 0 28px;">
          <p style="margin:0 0 12px;color:#1A4450;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Tips for next upload:</p>
          <ul style="margin:0;padding:0 0 0 18px;color:#6b7280;font-size:13px;line-height:2;">
            <li>Use high resolution images (min 500px)</li>
            <li>Ensure the logo is original work</li>
            <li>Use transparent or clean background</li>
            <li>No watermarks on uploaded image</li>
          </ul>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/upload" style="display:inline-block;background:#1A4450;color:#fff;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 36px;border-radius:8px;text-decoration:none;">
            Try Again →
          </a>
        </div>
        <p style="color:#9ca3af;font-size:13px;line-height:1.7;margin:0;">Don't be discouraged — we'd love to feature your work!</p>
      </td></tr>
    `),
  };
}

export function emailWelcome(name: string, username: string) {
  const steps = ["Upload your first logo", "Wait for admin approval (24-48h)", "Your logo goes live for the world to see"];
  return {
    subject: `Welcome to LogoVines, ${name}!`,
    html: wrapper(`
      <tr><td style="padding:32px;">
        <h2 style="margin:0 0 16px;color:#1A4450;font-size:20px;font-weight:700;">Welcome aboard!</h2>
        <p style="color:#374151;font-size:15px;margin:0 0 12px;">Hi <strong style="color:#1A4450;">${name}</strong>,</p>
        <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 24px;">
          Your account is ready. Start uploading your logo designs and share them with the world!
        </p>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
          <p style="margin:0 0 6px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Your Account</p>
          <p style="margin:0;color:#1A4450;font-size:15px;font-weight:600;">@${username}</p>
        </div>
        <p style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Get started in 3 steps:</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${steps.map((step, i) => `
          <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:28px;height:28px;background:#1A4450;border-radius:50%;text-align:center;vertical-align:middle;">
                <span style="color:#fff;font-weight:700;font-size:12px;">${i + 1}</span>
              </td>
              <td style="padding-left:12px;color:#6b7280;font-size:13px;">${step}</td>
            </tr></table>
          </td></tr>`).join("")}
        </table>
        <div style="text-align:center;margin:28px 0 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/upload" style="display:inline-block;background:#1A4450;color:#fff;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 36px;border-radius:8px;text-decoration:none;">
            Upload Your First Logo →
          </a>
        </div>
      </td></tr>
    `),
  };
}

export function emailVerification(name: string, verifyUrl: string) {
  return {
    subject: `Verify your LogoVines email address`,
    html: wrapper(`
      <tr><td style="padding:32px;text-align:center;">
        <div style="width:60px;height:60px;background:#f0f9ff;border:2px solid #bae6fd;border-radius:50%;margin:0 auto 20px;line-height:60px;font-size:24px;">✉️</div>
        <h2 style="margin:0 0 12px;color:#1A4450;font-size:20px;font-weight:700;">Verify your email address</h2>
        <p style="color:#374151;font-size:15px;margin:0 0 8px;">Hi <strong style="color:#1A4450;">${name}</strong>,</p>
        <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 28px;">
          Thanks for signing up! Click the button below to verify your email and activate your account.
        </p>
        <a href="${verifyUrl}" style="display:inline-block;background:#1A4450;color:#fff;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 36px;border-radius:8px;text-decoration:none;">
          Verify Email Address →
        </a>
        <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;line-height:1.7;">
          This link expires in <strong style="color:#6b7280;">24 hours</strong>.<br/>
          If you didn't create an account, ignore this email.
        </p>
        <div style="margin:20px 0 0;padding:14px;background:#f9fafb;border-radius:8px;word-break:break-all;">
          <p style="color:#9ca3af;font-size:11px;margin:0 0 4px;">Or copy this link:</p>
          <p style="color:#1A4450;font-size:11px;margin:0;">${verifyUrl}</p>
        </div>
      </td></tr>
    `),
  };
}

export function emailVerify(name: string, verifyUrl: string) {
  return emailVerification(name, verifyUrl);
}