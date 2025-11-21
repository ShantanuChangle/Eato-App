const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendDeliveryOtpEmail(to, otp, orderId) {
  console.log('A) sendDeliveryOtpEmail CALLED with:', { to, otp, orderId });

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Your Eato Delivery Confirmation OTP',
    text: `Your OTP to confirm delivery for order ${orderId} is: ${otp}`,
    html: `<p>Your OTP to confirm delivery for order <strong>${orderId}</strong> is:</p><h2>${otp}</h2>`,
  };

  try {
    console.log('B) Sending email via SendGrid...');
    await sgMail.send(msg);
    console.log('C) SendGrid SEND SUCCESS for:', to);
  } catch (error) {
    console.error('D) Error sending OTP email:', error.message);
    if (error.response) {
      console.error('E) SendGrid response body:', error.response.body);
    }
  }
}

module.exports = { sendDeliveryOtpEmail };

