import nodemailer from 'nodemailer';

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass },
});

export async function sendVerificationEmail(to: string, token: string) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/verify?token=${token}`;
  await transporter.sendMail({
    from: user,
    to,
    subject: 'Verify your GameLog account',
    html: `<h2>Verify your GameLog account</h2><p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`
  });
}
