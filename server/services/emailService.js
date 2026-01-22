import nodemailer from 'nodemailer'

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER || "sharmaharshharsh1234@gmail.com",
    pass: process.env.EMAIL_PASS || 'lgow jqbh zzot jysf',
  },
});

export default transporter;
