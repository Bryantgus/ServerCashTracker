import express from 'express'
import morgan from 'morgan'
import connectDB from './config/db'
import budgetRouter from './router/budgetRouter'

connectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/budgets', budgetRouter)

export default app