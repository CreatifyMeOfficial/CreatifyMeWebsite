const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, htmlText) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: to,
    html: htmlText,
    subject: subject
  });

};

module.exports = { sendEmail };