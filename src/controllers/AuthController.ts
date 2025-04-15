import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../ultis/auth";
import { generateToken } from "../ultis/token";

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
            res.json('Cuenta Creada Correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}

export default AuthController