import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    source: String,
    category: String,
    date: { type: Date, required: true },
});

export default mongoose.models.Income || mongoose.model("Income", incomeSchema);
