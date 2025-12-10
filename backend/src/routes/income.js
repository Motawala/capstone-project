import express from "express"
import Income from "../models/Income.js"

// Router for Income Routes
const incomeRouter = express.Router()

/*
    POST Route used to add income to the database.
 */
incomeRouter.post("/addIncome", async (req, res) => {
    try {
        const { userId, date, amount, category, source, paymentMethod } = req.body
        const income = await Income.create({
            userId,
            amount,
            category,
            source,
            date,
        })

        res.status(201).json(income)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default incomeRouter;
