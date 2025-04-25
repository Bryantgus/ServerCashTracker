import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../ultis/auth";
import { generateToken } from "../ultis/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
    static createAccount = async (req: Request, res: Response) =>  {
        const { email, password } = req.body
        //Prevenir duplicados
        const userExist = await User.findOne({where: {email}})
        if(userExist) {
            const error = new Error('Un usuario con ese email a esta registrado')
            res.status(409).json({error: error.message})
            return
        }
        try {
            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.token = generateToken()
            await user.save()

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })
            res.json('Cuenta Creada Correctamente')
            return
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) =>  {
        const { token } = req.body
        const user = await User.findOne({where: { token }})

        if(!user) {
            const error = new Error('Token no valido')
            res.status(401).json({error: error.message})
        }
        user.confirmed = true
        await user.save()
        res.json(user)
        
    }

    static login = async (req: Request, res: Response) =>  {
        const { email, password } = req.body
        //Prevenir duplicados
        const userExist = await User.findOne({where: {email}})
        if(!userExist) {
            const error = new Error('Usuario no encontrado')
            res.status(409).json({error: error.message})
            return
        }

        
        
        
    }
}

export default AuthController