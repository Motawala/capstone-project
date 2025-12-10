import express from "express";
import { computeMonthlyBalance } from "../services/balanceService.js";

const balanceRouter = express.Router();

balanceRouter.get("/monthlyBalance", async (req, res) => {
    try {
        const { userId, month, year } = req.query;

        if (!userId || !month || !year) {
            return res.status(400).json({ message: "userId, month, and year required" });
        }

        const result = await computeMonthlyBalance(userId, Number(month), Number(year));
        res.json(result);

    } catch (error) {
        console.error("Balance calculation error:", error);
        res.status(500).json({ message: error.message });
    }
});

export default balanceRouter;
