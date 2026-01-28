const Brevo = require('@getbrevo/brevo');

// Initialize the API client
const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendEmail = async (to, subject, htmlText) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlText;
  sendSmtpEmail.sender = { name: "Creatify Me", email: process.env.EMAIL_FROM };
  sendSmtpEmail.to = [{ email: to }];

  const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
  return data;
};

module.exports = { sendEmail };