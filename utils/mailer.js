import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE, // gmail
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
});

export const sendMail = async ({ to, subject, text, html }) => {
    try {
        await transporter.sendMail({
            from: `"Ecommerce" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log(`Correo enviado a ${to}`);
    } catch (error) {
        console.error('Error enviando mail:', error);
        throw new Error('No se pudo enviar el correo');
    }
};
