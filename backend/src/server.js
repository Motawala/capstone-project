import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import app from "./app.js";

// Render requires using PORT (not BACKEND_PORT)
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
    console.log(`SpendSmart backend running on port ${PORT}...`);
});

