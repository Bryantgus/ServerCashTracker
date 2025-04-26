import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import { body, param } from "express-validator"
import { handleInputsErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

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
    body('token')   
        .notEmpty()
        .withMessage('Token no valido')
        .isLength({min:6, max:6}),
    handleInputsErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    body('password')
        .notEmpty().withMessage('El password es obligatorio'),
        handleInputsErrors,
    AuthController.login
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('E-mail no valido'),
        handleInputsErrors,
    AuthController.forgotPassword
    )

router.post('/validate-token',
    body('token')   
        .notEmpty()
        .withMessage('Token no valido')
        .isLength({min:6, max:6}),
        handleInputsErrors,
    AuthController.validateToken
    )

router.post('/reset-password/:token',
        param('token')   
            .notEmpty()
            .withMessage('Token no valido')
            .isLength({min:6, max:6}),
            handleInputsErrors,
        body('password')
            .notEmpty()
            .withMessage("El password es muy corto")
            .isLength({min:8}),
            handleInputsErrors,
        AuthController.resetPassword
        )

router.get('/user',
    AuthController.user
)
export default router