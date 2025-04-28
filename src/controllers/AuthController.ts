import { Request, Response } from "express";
import  jwt from "jsonwebtoken";
import User from "../models/User";
import { checkPassword, hashPassword } from "../ultis/auth";
import { generateToken } from "../ultis/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../ultis/jwt";

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
        const { token, password } = req.body
        const user = await User.findOne({where: { token }})

        if(!user) {
            const error = new Error('Token no valido')
            res.status(401).json({error: error.message})
        }
        user.confirmed = true
        user.token = null
        await user.save()
        res.json("Cuenta confirmada correctamente")
    }

    static login = async (req: Request, res: Response) =>  {
        const { email, password } = req.body
        //Revisar que el usuario exista
        const user = await User.findOne({where: {email}})
        if(!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({error: error.message})
            return
        }
        console.log(user.confirmed);
        
        if(!user.confirmed) {
            const error = new Error('La cuenta no ha sido confirmada')
            res.status(403).json({error: error.message})
            return
        }
        
        const isPasswordCorrect = await checkPassword(password, user.password)

        if(!isPasswordCorrect) {
            const error = new Error('La contraseña es incorrecta')
            res.status(401).json({error: error.message})
            return
        }

        const token = generateJWT(user.id)
        res.json(token)
        return    
    }

    static forgotPassword = async (req: Request, res: Response) =>  {
        const { email }  = req.body

        //Revisar que el usuario exista
        const user = await User.findOne({where: {email}})
        if(!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({error: error.message})
            return
        }

        user.token = generateToken()
        await user.save()

        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        })
        res.json("Revisa tu email para instrucciones")
        return
    }

    static validateToken = async (req: Request, res: Response) =>  {
        const { token } = req.body       
        const tokenExists = await User.findOne({where: {token}})
        if(!tokenExists) {
            const error = new Error('Token no valido')
            res.status(404).json({error: error.message})
            return
        }
        res.json('Token valido')
        return
    }

    static resetPassword = async (req: Request, res: Response) =>  {
        const { token } = req.params
        const { password } = req.body
        const user = await User.findOne({where: {token}})
        if(!user) {
            const error = new Error('Token no valido')
            res.status(404).json({error: error.message})
            return
        }

        //Asignar nuevo password
        user.password = await hashPassword(password)
        user.token = null
        await user.save()
        res.json("La Contraseña se modifico correctamente")
        return
    }

    static user = async (req: Request, res: Response) =>  {
        const bearer = req.headers.authorization
        if(!bearer) {
            const error = new Error('No Autorizado')
            res.status(401).json({ error: error.message})
            return
        }
        const [ , token] = bearer.split(" ")
        if(!token) {
            const error = new Error('Token no valido')
            res.status(401).json({ error: error.message})
            return
        }

        
        try {
            const decoded = jwt.verify(token, "Palabrasecreta")
            if(typeof decoded === 'object' && decoded.id) {
                const user = await User.findByPk(decoded.id, {
                    attributes: ['id', 'name', 'email']
                })
                res.json(user)
            }
            return
            
        } catch (error) {
            res.status(500).json({error: "Token no valido"})            
        }
        

    }
}


export default AuthController