import nodemailer from 'nodemailer'

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "sharmaharshharsh1234@gmail.com",
    pass: process.env.EMAIL_PASS || 'lgow jqbh zzot jysf',
  },
  // Add timeout and connection settings for serverless environments
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export default transporter;
