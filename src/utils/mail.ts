import { env } from "@/config/env";
import Mailgen from "mailgen";
import nodemailer from "nodemailer"

type optionType = {
    email: string,
    subject: string,
    mailGenContent: Mailgen.Content
}

export const sendMail = async (options: optionType) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'Task Manager',
            link: 'https://mailgen.js/'
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    });

    // var emailBody = mailGenerator.generate(options);
    var emailText = mailGenerator.generatePlaintext(options.mailGenContent);
    var emailHTML = mailGenerator.generate(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: env.MAILTRAP_HOST_NAME,
        port: 2525,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: env.MAILTRAP_USERNAME,
            pass: env.MAILTRAP_PASSWORD,
        },
    });

    const mail = {
        from: `info@${env.APP_NAME}.com`, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: emailText, // plain text body
        html: emailHTML, // html body
    }

    try {
        await transporter.sendMail(mail)
        return true
    } catch (error) {
        console.log("Problem while sending ")
    }

    return false
}

export const emailVerificationMailGenContent = (firstname: string, verificationUrl: string) => {
    return {
        body: {
            name: firstname,
            intro: `Welcome to ${env.APP_NAME}! We\'re very excited to have you on board.`,
            action: {
                instructions: 'To get started with ourApp, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify your email',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}
export const forgotPasswordMailGenContent = (firstname: string, passwordResetUrl: string) => {
    return {
        body: {
            name: firstname,
            intro: `We got a request to reset your password `,
            action: {
                instructions: 'To change your password, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset Password',
                    link: passwordResetUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

