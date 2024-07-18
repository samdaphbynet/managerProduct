import nodemailer from 'nodemailer';

export const sendEmail = async (send_from, send_to, subject, message, reply_to) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false,
        }
    })

    const option = {
        from: send_from,
        to: send_to,
        subject: subject,
        html: message,
        replyTo: reply_to,
    }

    transporter.sendMail(option, function (err, info) {
        if (err) {
            console.log("Error sending email", err)
        } else {
            console.log("Email sent successfully", info.response);
        }
    })
}