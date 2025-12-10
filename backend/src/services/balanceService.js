import Income from "../models/income.js";
import Expense from "../models/expense.js";
import mongoose from "mongoose";
import income from "../models/income.js";

/**
 * Helper: Convert month (1–12) to date range
 */
function getMonthRange(month, year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    return { start, end };
}

/**
 * 1️⃣ Get Total Income + Expenses for a Month
 */
export async function getMonthlyTotals(userId, month, year) {
    const { start, end } = getMonthRange(month, year);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const incomes = await Income.aggregate([
        { $match: { userId: userObjectId, date: { $gte: start, $lt: end } } },
        { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
    ]);

    const expenses = await Expense.aggregate([
        { $match: { userId: userObjectId, date: { $gte: start, $lt: end } } },
        { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
    ]);

    return {
        income: incomes[0]?.totalIncome || 0,
        expense: expenses[0]?.totalExpense || 0,
    };
}

/**
 * Get Cumulative Balance Up to Previous Month
 */
export async function getPreviousMonthBalance(userId, month, year) {
    let totalBalance = 0;

    // Compute all balances from January → previous month
    for (let m = 1; m < month; m++) {
        const { income, expense } = await getMonthlyTotals(userId, m, year);

        totalBalance += income - expense;
    }

    return totalBalance;
}

export async function computeMonthlyBalance(userId, month, year) {
    const previousBalance = await getPreviousMonthBalance(userId, month, year);
    const { income, expense } = await getMonthlyTotals(userId, month, year);
    return {
        previousBalance,
        currentIncome: income,
        currentExpense: expense,
        monthlyNet: income - expense,
        finalBalance: previousBalance + income - expense
    };
}
