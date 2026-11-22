const nodemailer = require('nodemailer');

const createTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    return null;
};

/**
 * HU-03: Envía el correo de bienvenida con el código único al usuario
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
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #1a365d; margin: 0 0 8px 0;">¡Bienvenido/a a la Biblioteca Pública de Ciudad Quesada!</h2>
                        <p style="color: #4a5568; margin: 0;">Sistema de Gestión de Usuarios y Préstamos</p>
                    </div>
                    <p style="color: #2d3748; font-size: 15px;">Hola <strong>${name}</strong>,</p>
                    <p style="color: #4a5568; line-height: 1.6;">Tu registro se ha completado exitosamente. A continuación te compartimos tu <strong>código único de 4 dígitos</strong>:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="background-color: #2b6cb0; color: #ffffff; padding: 14px 32px; font-size: 26px; font-weight: bold; letter-spacing: 4px; border-radius: 8px; display: inline-block;">
                            ${userCode}
                        </span>
                    </div>
                    <p style="color: #4a5568; font-size: 14px; line-height: 1.5;">
                        Utiliza este código para registrar tu ingreso (Check-in) en la biblioteca o al solicitar préstamos de libros y cubículos.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #a0aec0; text-align: center; margin: 0;">
                        Biblioteca Pública de Ciudad Quesada · Mensaje automático generado por el sistema.
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

