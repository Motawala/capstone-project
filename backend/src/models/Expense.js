import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    amount: { type: Number, required: true },
    category: {
        type: String,
        enum: ["Food", "Bills", "Shopping", "Travel", "Entertainment", "Other"],
        required: true,
    },
    description: String,
    date: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
});

export default mongoose.model("Expense", expenseSchema);
