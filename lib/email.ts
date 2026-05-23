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
      from:       `"LogoVines" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      headers: {
        "X-Priority":        "3",
        "X-Mailer":          "LogoVines Mailer",
        "X-MSMail-Priority": "Normal",
        "Importance":        "Normal",
      },
    });
    console.log("[EMAIL] Sent to:", to);
  } catch (error) {
    console.error("[EMAIL ERROR]:", error);
  }
}

// ── Email Templates ──────────────────────────────────────

export function emailApproved(name: string, logoTitle: string, logoId: string) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/logo/${logoId}`;
  return {
    subject: `✅ Your logo "${logoTitle}" has been approved!`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a1206,#111);padding:32px;text-align:center;border-bottom:1px solid rgba(212,163,115,0.2);">
          <h1 style="margin:0;color:#d4a373;font-size:26px;font-weight:800;letter-spacing:4px;text-transform:uppercase;">LOGO VINES</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Graphic Design Studio</p>
        </td></tr>

        <!-- Green banner -->
        <tr><td style="background:#14532d;padding:16px 32px;text-align:center;">
          <p style="margin:0;color:#4ade80;font-size:15px;font-weight:700;letter-spacing:1px;">✅ Logo Approved &amp; Now Live!</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 32px;">
          <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 12px;">Hi <strong style="color:#d4a373;">${name}</strong>,</p>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0 0 24px;">
            Great news! Your logo <strong style="color:#fff;">"${logoTitle}"</strong> has been reviewed and approved by our team. It is now live on LogoVines and visible to everyone.
          </p>

          <!-- Logo title card -->
          <div style="background:rgba(212,163,115,0.08);border:1px solid rgba(212,163,115,0.25);border-radius:10px;padding:16px 20px;margin:0 0 28px;">
            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:10px;text-transform:uppercase;letter-spacing:2px;">Logo</p>
            <p style="margin:6px 0 0;color:#fff;font-size:16px;font-weight:600;">${logoTitle}</p>
          </div>

          <!-- CTA Button -->
          <div style="text-align:center;margin:28px 0;">
            <a href="${url}" style="display:inline-block;background:#d4a373;color:#000;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 36px;border-radius:8px;text-decoration:none;">
              View Your Logo →
            </a>
          </div>

          <p style="color:rgba(255,255,255,0.4);font-size:13px;line-height:1.7;margin:0;">
            Keep uploading great designs. The more you share, the more people discover your work!
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;">© ${new Date().getFullYear()} LogoVines · You're receiving this because you uploaded a logo.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

export function emailRejected(name: string, logoTitle: string) {
  return {
    subject: `❌ Your logo "${logoTitle}" was not approved`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a1206,#111);padding:32px;text-align:center;border-bottom:1px solid rgba(212,163,115,0.2);">
          <h1 style="margin:0;color:#d4a373;font-size:26px;font-weight:800;letter-spacing:4px;text-transform:uppercase;">LOGO VINES</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Graphic Design Studio</p>
        </td></tr>

        <!-- Red banner -->
        <tr><td style="background:#450a0a;padding:16px 32px;text-align:center;">
          <p style="margin:0;color:#f87171;font-size:15px;font-weight:700;letter-spacing:1px;">❌ Logo Not Approved</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 32px;">
          <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 12px;">Hi <strong style="color:#d4a373;">${name}</strong>,</p>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0 0 24px;">
            Unfortunately, your logo <strong style="color:#fff;">"${logoTitle}"</strong> did not meet our quality guidelines and was not approved at this time.
          </p>

          <!-- Tips -->
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px 24px;margin:0 0 28px;">
            <p style="margin:0 0 12px;color:#d4a373;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Tips for next upload:</p>
            <ul style="margin:0;padding:0 0 0 18px;color:rgba(255,255,255,0.5);font-size:13px;line-height:2;">
              <li>Use high resolution images (min 500px)</li>
              <li>Ensure the logo is original work</li>
              <li>Use transparent or clean background</li>
              <li>No watermarks on uploaded image</li>
            </ul>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin:28px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/upload" style="display:inline-block;background:#d4a373;color:#000;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 36px;border-radius:8px;text-decoration:none;">
              Try Again →
            </a>
          </div>

          <p style="color:rgba(255,255,255,0.4);font-size:13px;line-height:1.7;margin:0;">
            Don't be discouraged — review the tips above and submit an improved version. We'd love to feature your work!
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;">© ${new Date().getFullYear()} LogoVines · You're receiving this because you uploaded a logo.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

export function emailWelcome(name: string, username: string) {
  return {
    subject: `👋 Welcome to LogoVines, ${name}!`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a1206,#111);padding:40px 32px;text-align:center;border-bottom:1px solid rgba(212,163,115,0.2);">
          <h1 style="margin:0;color:#d4a373;font-size:26px;font-weight:800;letter-spacing:4px;text-transform:uppercase;">LOGO VINES</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Graphic Design Studio</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 32px;">
          <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:700;">Welcome aboard! 🎉</h2>
          <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 12px;">Hi <strong style="color:#d4a373;">${name}</strong>,</p>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0 0 28px;">
            Your account has been created successfully. You can now upload your logo designs and share them with the world!
          </p>

          <!-- Account info -->
          <div style="background:rgba(212,163,115,0.08);border:1px solid rgba(212,163,115,0.2);border-radius:10px;padding:20px 24px;margin:0 0 28px;">
            <p style="margin:0 0 10px;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:2px;">Your Account</p>
            <p style="margin:0;color:#fff;font-size:15px;">@<strong style="color:#d4a373;">${username}</strong></p>
          </div>

          <!-- Steps -->
          <p style="color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 14px;">Get started in 3 steps:</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${["Upload your first logo", "Wait for admin approval (24-48h)", "Your logo goes live for the world to see"].map((step, i) => `
            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;height:28px;background:rgba(212,163,115,0.15);border-radius:50%;text-align:center;vertical-align:middle;">
                  <span style="color:#d4a373;font-weight:700;font-size:12px;">${i + 1}</span>
                </td>
                <td style="padding-left:12px;color:rgba(255,255,255,0.6);font-size:13px;">${step}</td>
              </tr></table>
            </td></tr>`).join("")}
          </table>

          <!-- CTA -->
          <div style="text-align:center;margin:32px 0 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/upload" style="display:inline-block;background:#d4a373;color:#000;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 36px;border-radius:8px;text-decoration:none;">
              Upload Your First Logo →
            </a>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;">© ${new Date().getFullYear()} LogoVines · Welcome to the community!</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

export function emailVerify(name: string, verifyUrl: string) {
  return {
    subject: "✉ Please verify your LogoVines email address",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a1206,#111);padding:32px;text-align:center;border-bottom:1px solid rgba(212,163,115,0.2);">
          <h1 style="margin:0;color:#d4a373;font-size:26px;font-weight:800;letter-spacing:4px;text-transform:uppercase;">LOGO VINES</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Graphic Design Studio</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 32px;">
          <h2 style="margin:0 0 16px;color:#fff;font-size:20px;font-weight:700;">Verify your email address</h2>
          <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 12px;">Hi <strong style="color:#d4a373;">${name}</strong>,</p>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0 0 32px;">
            Thanks for signing up! Please verify your email address to activate your account and start uploading logos.
          </p>

          <!-- CTA Button -->
          <div style="text-align:center;margin:0 0 32px;">
            <a href="${verifyUrl}" style="display:inline-block;background:#d4a373;color:#000;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:16px 40px;border-radius:8px;text-decoration:none;">
              ✓ Verify Email Address
            </a>
          </div>

          <!-- Expiry notice -->
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;margin:0 0 24px;">
            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;line-height:1.6;">
              ⏰ This link expires in <strong style="color:rgba(255,255,255,0.6);">24 hours</strong>.<br/>
              If you did not create an account, you can safely ignore this email.
            </p>
          </div>

          <!-- Raw link fallback -->
          <p style="color:rgba(255,255,255,0.3);font-size:11px;line-height:1.6;margin:0;">
            If the button doesn't work, copy this link:<br/>
            <a href="${verifyUrl}" style="color:#d4a373;word-break:break-all;">${verifyUrl}</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;">© ${new Date().getFullYear()} LogoVines · If you didn't sign up, ignore this email.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

export function emailVerification(name: string, verifyUrl: string) {
  return {
    subject: `✉️ Verify your LogoVines email address`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

        <tr><td style="background:linear-gradient(135deg,#1a1206,#111);padding:32px;text-align:center;border-bottom:1px solid rgba(212,163,115,0.2);">
          <h1 style="margin:0;color:#d4a373;font-size:26px;font-weight:800;letter-spacing:4px;text-transform:uppercase;">LOGO VINES</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Graphic Design Studio</p>
        </td></tr>

        <tr><td style="padding:40px 32px;text-align:center;">
          <div style="width:64px;height:64px;background:rgba(212,163,115,0.1);border:2px solid rgba(212,163,115,0.3);border-radius:50%;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:64px;">✉️</div>
          <h2 style="margin:0 0 12px;color:#fff;font-size:20px;font-weight:700;">Verify your email address</h2>
          <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 8px;">Hi <strong style="color:#d4a373;">${name}</strong>,</p>
          <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.7;margin:0 0 32px;">
            Thanks for signing up! Click the button below to verify your email address and activate your account.
          </p>

          <a href="${verifyUrl}" style="display:inline-block;background:#d4a373;color:#000;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:16px 40px;border-radius:8px;text-decoration:none;">
            Verify Email Address →
          </a>

          <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:28px 0 0;line-height:1.7;">
            This link expires in <strong style="color:rgba(255,255,255,0.5);">24 hours</strong>.<br/>
            If you didn't create an account, you can safely ignore this email.
          </p>

          <div style="margin:24px 0 0;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px;word-break:break-all;">
            <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0 0 6px;">Or copy this link:</p>
            <p style="color:#d4a373;font-size:11px;margin:0;">${verifyUrl}</p>
          </div>
        </td></tr>

        <tr><td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;">© ${new Date().getFullYear()} LogoVines · If you didn't sign up, ignore this email.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}