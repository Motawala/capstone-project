import express from "express";
import { getMonthlyTransactions } from "../services/transactionService.js";

const transactionRouter = express.Router();

transactionRouter.get("/monthlyTransactions", async (req, res) => {
    try {
        const { userId, month, year } = req.query;
        if (!userId || !month || !year) {
            return res.status(400).json({ message: "userId, month, year are required" });
        }

        const transactions = await getMonthlyTransactions(userId, Number(month), Number(year));

        res.json({
            month,
            year,
            total: transactions.reduce((sum, t) =>
                t.type === "income" ? sum + t.amount : sum - t.amount, 0),
            transactions
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default transactionRouter;
