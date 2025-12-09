import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "SpendSmart Backend" });
});

export default app;
