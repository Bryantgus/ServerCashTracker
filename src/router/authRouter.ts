import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import { body } from "express-validator"
import { handleInputsErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'

const router = Router()

router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputsErrors,
    AuthController.createAccount
)

router.post('/confirm-account', 
    limiter,
    body('token')   
        .notEmpty()
        .withMessage('Token no valido')
        .isLength({min:6, max:6}),
    handleInputsErrors,
    AuthController.confirmAccount
)
export default router