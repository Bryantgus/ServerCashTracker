import { transport } from "../config/nodemailer"

type EmailType = {
    name: string
    email: string 
    token: string
}


export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTracker <no-reply@cashtracker.com>',
            to: user.email,
            subject: 'CashTracker Confirma tu cuenta',
            html: `
                <p>Hola ${user.name}, has creado tu cuenta en CashTracker, ya esta casi lista</p>
                <p>Visita el siguiente enlace</p>
                <a href='#'>Confirmar cuenta</a>
                <p>E ingresa el codigo: <b>${user.token}</b></p>
            `
        })
        console.log(email);
        
    }

    static sendPasswordResetToken = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTracker <no-reply@cashtracker.com>',
            to: user.email,
            subject: 'CashTracker - Restablece tu password',
            html: `
                <p>Hola ${user.name}, has solicitado restablecer tu password</p>
                <p>Visita el siguiente enlace</p>
                <a href='#'>Reestablecer password</a>
                <p>E ingresa el codigo: <b>${user.token}</b></p>
            `
        })

        
    }
}

