import { Request, Response, NextFunction } from "express"
import { body } from "express-validator"


export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('name')
        .notEmpty().withMessage("El nombre del gasto no puede ir vacio").run(req)

    await body('amount')
        .notEmpty().withMessage("El gasto no puede ir vacio")
        .isNumeric().withMessage("Cantidad no valida")
        .custom(value => value > 0).withMessage("El gasto debe ser mayor a cero").run(req)
    next()
}