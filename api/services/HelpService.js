const nodemailer = require('nodemailer');
module.exports = {
  sendEmail: async function (to, subject, message) {
    // Create a transporter object
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "meomeoerptest@gmail.com",
        pass: "znrjmwgnlfjrhhtj",
      },
    });

    // Define the email options
    let mailOptions = {
      from: '"Project application ',
      to: to,
      subject: subject,
      text: message,
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
  },
   generatePassword() {
    var password = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (var i = 0; i < 8; i++) {
      password += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return password;
  }

};
