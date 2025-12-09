import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
// import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 4000;

// connect to MongoDB
// connectDB();

app.listen(PORT, () => {
    console.log(`SpendSmart backend running on port ${PORT}...`);
});
