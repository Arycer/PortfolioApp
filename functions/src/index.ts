import * as functions from 'firebase-functions/v2';
import * as nodemailer from 'nodemailer';

interface EmailData {
    name: string;
    email: string;
    message: string;
}

interface EmailError {
    code?: string;
    message: string;
}

// Función para enviar correo
export const sendEmail = functions.https.onCall({
    secrets: ["EMAIL_USER", "EMAIL_PASSWORD"]
}, async (request) => {
    const { name, email, message } = request.data as EmailData;

    // Verificar las variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('Error: Missing email configuration');
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Error de configuración del servidor de correo'
        );
    }

    // Configuración del transportador de correo
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    try {
        // Verificar la conexión con el servidor SMTP
        await transporter.verify();

        // Configuración del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Nuevo mensaje de ${name} desde el portafolio`,
            text: `
                Nombre: ${name}
                Email: ${email}
                
                Mensaje:
                ${message}
            `,
            html: `
                <h3>Nuevo mensaje desde el portafolio</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <br>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
            `
        };

        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error: unknown) {
        const emailError = error as EmailError;
        console.error('Error sending email:', emailError);
        
        // Determinar el tipo de error para dar una respuesta más específica
        if (emailError.code === 'EAUTH') {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'Error de autenticación con el servidor de correo'
            );
        } else if (emailError.code === 'ESOCKET') {
            throw new functions.https.HttpsError(
                'unavailable',
                'Error de conexión con el servidor de correo'
            );
        } else {
            throw new functions.https.HttpsError(
                'internal',
                'Error al enviar el correo: ' + emailError.message
            );
        }
    }
});
