import sgMail from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_API_TOKEN, SENDGRID_EMAIL_FROM } = process.env;

sgMail.setApiKey(SENDGRID_API_TOKEN);
const msg = {
  to: "test@example.com",
  from: "test@example.com", // Use the email address or domain you verified above
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

const sendEmail = async (data) => {
  try {
    const email = await sgMail.send({ ...data, from: SENDGRID_EMAIL_FROM });
    return sendEmail(email);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

export default sendEmail;
