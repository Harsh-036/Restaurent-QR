import nodemailer from 'nodemailer'

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sharmaharshharsh1234@gmail.com",
    pass: 'lgow jqbh zzot jysf',
  },
});

export default transporter;