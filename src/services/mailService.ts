import {getFunctions, httpsCallable} from 'firebase/functions';

/**
 * Envía un mensaje de contacto utilizando Firebase Functions
 *
 * @param name - Nombre del remitente
 * @param email - Correo electrónico del remitente
 * @param message - Mensaje a enviar
 * @returns Una promesa que se resuelve cuando el mensaje se envía correctamente
 */
export const sendContactMessage = async (name: string, email: string, message: string): Promise<void> => {
    try {
        const functions = getFunctions();
        const sendEmail = httpsCallable(functions, 'sendEmail');

        await sendEmail({
            name,
            email,
            message
        });

    } catch (error) {
        console.error('Error al enviar el mensaje de contacto:', error);
        throw error;
    }
}; 