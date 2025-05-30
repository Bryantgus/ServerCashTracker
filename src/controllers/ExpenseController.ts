import type { Request, Response } from "express"
import Expense from "../models/Expense";

export class ExpensesController {

    static create  = async (req: Request, res: Response) => {
        try {
            const expense = new Expense(req.body)
            expense.budgetId = req.budget.id
            await expense.save()
            res.status(201).json('Gasto agregado correctamente')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getById  = async (req: Request, res: Response) => {
        res.send(req.expense)
        return
    }

    static updateById = async (req: Request, res: Response) => {
        req.expense.update(req.body)
        res.json("Se actualizo correctamente")
        return
    }

    static deleteById = async (req: Request, res: Response) => {
        req.expense.destroy()
        res.json("Gasto eliminado")
        return
    }
}