import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
// import { connectDB } from "./config/db.js";

const PORT = process.env.BACKEND_PORT;

// connect to MongoDB
// connectDB();

app.listen(PORT, () => {
    console.log(`SpendSmart backend running on port ${PORT}...`);
});
