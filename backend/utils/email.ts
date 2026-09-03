import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: `"Autonix" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html,
  })
}

export const getVerificationEmailHtml = (name: string, token: string): string => {
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Welcome to Autonix, ${name}!</h2>
      <p>Click the button below to verify your email address.</p>
      <a href="${link}" style="
        display: inline-block;
        background: #6366F1;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
      ">Verify Email</a>
      <p style="color: #A1A1A1; font-size: 13px;">Please verify within 7 days or your account will be removed.</p>
    </div>
  `
}

export const getPasswordResetEmailHtml = (name: string, token: string): string => {
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Reset your password</h2>
      <p>Hi ${name}, click below to reset your Autonix password.</p>
      <a href="${link}" style="
        display: inline-block;
        background: #6366F1;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
      ">Reset Password</a>
      <p style="color: #A1A1A1; font-size: 13px;">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>
  `
}