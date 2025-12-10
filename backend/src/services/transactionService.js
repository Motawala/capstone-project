import Income from "../models/income.js";
import Expense from "../models/expense.js";
import mongoose from "mongoose";

export async function getMonthlyTransactions(userId, month, year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const uid = new mongoose.Types.ObjectId(userId);

    // Fetch incomes
    const incomes = await Income.find({
        userId: uid,
        date: { $gte: start, $lt: end }
    });

    // Fetch expenses
    const expenses = await Expense.find({
        userId: uid,
        date: { $gte: start, $lt: end }
    });

    // Transform income records
    const incomeTransactions = incomes.map((inc) => ({
        type: "income",
        amount: inc.amount,
        category: inc.category,
        source: inc.source,
        date: inc.date,
        _id: inc._id
    }));

    // Transform expense records
    const expenseTransactions = expenses.map((exp) => ({
        type: "expense",
        amount: exp.amount,
        category: exp.category,
        paymentMethod: exp.paymentMethod,
        date: exp.date,
        _id: exp._id,
        description: exp.description,
    }));

    // Merge and sort by date
    const allTransactions = [...incomeTransactions, ...expenseTransactions].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    return allTransactions;
}
