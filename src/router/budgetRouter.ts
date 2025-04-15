import { Router } from "express"
import { BudgetController } from "../controllers/BudgetController"
import { handleInputsErrors } from "../middleware/validation"
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from "../middleware/budget"
import { ExpensesController } from "../controllers/ExpenseController"
import { validateExpenseExist, validateExpenseId, validateExpenseInput } from "../middleware/expense"
const router = Router()

router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExist)

router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExist)

//Get all elements of budget
router.get('/', BudgetController.getAll)

router.post('/',     
    validateBudgetInput,
    handleInputsErrors,
    BudgetController.create
)

//Get budget by Id
router.get('/:budgetId', BudgetController.getById)

//Change a budget sby Id
router.put('/:budgetId', 
    validateBudgetInput,
    handleInputsErrors,
    BudgetController.updateById)

//Delete a budget by Id    
router.delete('/:budgetId', BudgetController.deleteById)

// Routes for expenses 
router.post('/:budgetId/expenses',
    validateExpenseInput,
    handleInputsErrors,
    ExpensesController.create)

router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById)
router.put('/:budgetId/expenses/:expenseId', 
    validateExpenseInput,
    handleInputsErrors,
    ExpensesController.updateById)
router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)

export default router