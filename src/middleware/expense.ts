import { Request, Response, NextFunction } from "express"
import { body, param, validationResult } from "express-validator"
import Expense from "../models/Expense"
import Budget from "../models/Budget"

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('name')
        .notEmpty().withMessage("El nombre del gasto no puede ir vacio").run(req)

    await body('amount')
        .notEmpty().withMessage("El gasto no puede ir vacio")
        .isNumeric().withMessage("Cantidad no valida")
        .custom(value => value > 0).withMessage("El gasto debe ser mayor a cero").run(req)
    next()
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {

    await param('expenseId').isInt().custom(value => value > 0)
            .withMessage("El gasto debe ser mayor a cero").run(req)
            
    let errors = validationResult(req)
            if(!errors.isEmpty()) {
                res.status(400).json({errors: errors.array()})
                return
            } 
    next()
}

export const validateExpenseExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params
        const expense = await Expense.findByPk(expenseId)

        if(!expense){
            const error = new Error("Gasto no encontrado")
            res.status(404).json({error: error.message})
            return
        }
        req.expense = expense
        next()
    } catch (error) {
        // console.log(error);
        res.status(500).json({error: 'Hubo un error'})
    } 
    
}