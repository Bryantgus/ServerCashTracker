import { Router } from "express"
import { BudgetController } from "../controllers/BudgetController"
import { body, param } from "express-validator"
import { handleInputsErrors } from "../middleware/validation"
import { validateBudgetExist, validateBudgetId } from "../middleware/budget"
const router = Router()

router.param('id', validateBudgetId)
router.param('id', validateBudgetExist)

//Get all elements of budget
router.get('/', BudgetController.getAll)

router.post('/', 
    body('name')
        .notEmpty().withMessage("El nombre del presupuesto no puede ir vacio"),
        body('amount')
        .notEmpty().withMessage("El presupuesto no puede ir vacio")
        .isNumeric().withMessage("Cantidad no valida")
        .custom(value => value > 0).withMessage("El presupuesto debe ser mayor a cero"),
    handleInputsErrors,
    BudgetController.create
)

//Get budget by Id
router.get('/:id', BudgetController.getById)

//Change a budget by Id
router.put('/:id', 
    body('name')
        .notEmpty().withMessage("El nombre del presupuesto no puede ir vacio"),
    body('amount')
        .notEmpty().withMessage("El presupuesto no puede ir vacio")
        .isNumeric().withMessage("Cantidad no valida")
        .custom(value => value > 0).withMessage("El presupuesto debe ser mayor a cero"),
    handleInputsErrors,
    BudgetController.updateById)

//Delete a budget by Id    
router.delete('/:id', BudgetController.deleteById)

export default router