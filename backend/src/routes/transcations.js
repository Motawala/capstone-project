import express from "express";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
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


/**
 * DELETE /api/transactions/deleteTransaction?userId=123&transactionId=456
 */
transactionRouter.delete("/deleteTransaction", async (req, res) => {
    try {
        const { userId, transactionId } = req.query;

        if (!userId || !transactionId) {
            return res.status(400).json({
                status: "error",
                message: "userId and transactionId are required"
            });
        }

        // Try deleting from Income
        const income = await Income.findOneAndDelete({
            _id: transactionId,
            userId: userId
        });

        if (income) {
            return res.json({
                status: "success",
                type: "income",
                message: "Income deleted successfully",
                deleted: income
            });
        }

        // Try deleting from Expense
        const expense = await Expense.findOneAndDelete({
            _id: transactionId,
            userId: userId
        });

        if (expense) {
            return res.json({
                status: "success",
                type: "expense",
                message: "Expense deleted successfully",
                deleted: expense
            });
        }

        // If not found in either collection
        return res.status(404).json({
            status: "error",
            message: "Transaction not found"
        });

    } catch (error) {
        console.error("Delete Transaction Error:", error);
        res.status(500).json({
            status: "error",
            message: "Server error while deleting transaction",
            error: error.message
        });
    }
});


/**
 * GET /api/transactions/dailyCashflow?userId=xxx&month=1&year=2025
 */
transactionRouter.get("/dailyCashflow", async (req, res) => {
    try {
        const { userId, month, year } = req.query;

        if (!userId || !month || !year) {
            return res.status(400).json({ error: "userId, month, and year are required" });
        }

        const m = Number(month);
        const y = Number(year);

        // Month start + end
        const start = new Date(y, m - 1, 1);
        const end = new Date(y, m, 0); // last day of month

        // Fetch income + expenses for the month
        const incomes = await Income.find({
            userId,
            date: { $gte: start, $lte: end }
        });

        const expenses = await Expense.find({
            userId,
            date: { $gte: start, $lte: end }
        });

        const daysInMonth = new Date(y, m, 0).getDate();

        // Initialize daily array
        const daily = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            income: 0,
            expense: 0,
            net: 0
        }));

        // Process incomes
        incomes.forEach((inc) => {
            const d = new Date(inc.date).getDate();
            daily[d - 1].income += Number(inc.amount);
            daily[d - 1].net =
                daily[d - 1].income - daily[d - 1].expense;
        });

        // Process expenses
        expenses.forEach((exp) => {
            const d = new Date(exp.date).getDate();
            daily[d - 1].expense += Number(exp.amount);
            daily[d - 1].net =
                daily[d - 1].income - daily[d - 1].expense;
        });

        res.json({ daily });

    } catch (err) {
        console.error("Daily cashflow error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default transactionRouter;
