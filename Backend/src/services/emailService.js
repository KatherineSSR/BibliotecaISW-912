const nodemailer = require('nodemailer');

const createTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS.replace(/\s+/g, '')
            }
        });
    }
    return null;
};

/**
 * Envía el correo de bienvenida con el código de check-in al usuario
 */
const sendUserCodeEmail = async ({ to, name, userCode }) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            console.warn(`[EmailService] Credenciales de correo no configuradas en .env. Código para ${to} (${name}): ${userCode}`);
            return {
                sent: false,
                simulated: true,
                message: 'Credenciales de correo no configuradas en .env'
            };
        }

        const mailOptions = {
            from: `"Biblioteca Pública de Ciudad Quesada" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Tu código de acceso - Biblioteca Pública de Ciudad Quesada',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #1a365d; text-align: center;">¡Bienvenido/a a la Biblioteca Pública de Ciudad Quesada!</h2>
                    <p>Hola <strong>${name}</strong>,</p>
                    <p>Tu registro en el sistema se ha completado exitosamente. A continuación te compartimos tu código único de usuario:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="background-color: #2b6cb0; color: #ffffff; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 6px; display: inline-block;">
                            ${userCode}
                        </span>
                    </div>
                    <p style="color: #4a5568;">Utiliza este código cada vez que ingreses a la biblioteca para registrar tu entrada (Check-in).</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #718096; text-align: center;">
                        Biblioteca Pública de Ciudad Quesada · Sistema Automatizado
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Correo enviado exitosamente a ${to}: ${info.messageId}`);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error(`[EmailService] Error al enviar correo a ${to}:`, error.message);
        return { sent: false, error: error.message };
    }
};

module.exports = {
    sendUserCodeEmail
};
