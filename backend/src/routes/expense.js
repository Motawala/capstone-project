import express from "express"
import Expense from "../models/Expense.js"

// Router for Income Routes
const expenseRouter = express.Router()

expenseRouter.post("/addExpense", async (req, res) => {
    try {
        const { userId, date, amount, category, description, paymentMethod } = req.body
        const expense = await Expense.create({
            userId,
            amount,
            category,
            description,
            date,
            paymentMethod
        })

        res.status(201).json(expense)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default expenseRouter;
