import express from "express";
import cors from "cors";
import User from "./models/User.js";
import incomeRouter from "./routes/income.js";
import balanceRouter from "./routes/balance.js";
import expenseRouter from "./routes/expense.js";
import transactionRouter from "./routes/transcations.js";
import aiRouter from "./routes/aiAssistant.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ------------------------------------
   CORS CONFIGURATION (IMPORTANT)
------------------------------------ */

// FRONTEND URL (Vercel)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    })
);

// Parse JSON bodies
app.use(express.json());

/* ------------------------------------
   API ROUTES
------------------------------------ */
app.use("/api/income", incomeRouter);
app.use("/api/balance", balanceRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/ai", aiRouter);

/* ------------------------------------
   GOOGLE OAUTH CONFIG
------------------------------------ */
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_TOKEN_VERIFICATION_URL = process.env.GOOGLE_TOKEN_VERIFICATION_URL;

/* ------------------------------------
   HEALTH CHECK
------------------------------------ */
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "SpendSmart Backend" });
});

/* ------------------------------------
   VERIFY GOOGLE TOKEN
------------------------------------ */
const verifyGoogleToken = async (token) => {
    const response = await fetch(
        `${GOOGLE_TOKEN_VERIFICATION_URL}${encodeURIComponent(token)}`
    );

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const payload = await response.json();

    if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
        throw new Error("Token audience does not match credentials.");
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
        throw new Error("Token expired");
    }

    return payload;
};

/* ------------------------------------
   GOOGLE LOGIN ROUTE
------------------------------------ */
app.post("/auth/google", async (req, res) => {
    const { credentials } = req.body || {};
    if (!credentials) {
        return res
            .status(400)
            .json({ status: "Google credentials are required." });
    }

    try {
        const googleProfile = await verifyGoogleToken(credentials);

        let user = await User.findOne({ googleId: googleProfile.sub });

        if (!user) {
            user = await User.create({
                googleId: googleProfile.sub,
                name: googleProfile.name,
                email: googleProfile.email,
                picture: googleProfile.picture,
            });

            console.log("New Google user created.");
        }

        const userObj = {
            id: user._id,
            name: googleProfile.name,
            email: googleProfile.email,
            picture: googleProfile.picture,
            expiresAt: googleProfile.exp,
        };

        console.log("User successfully logged in.");
        return res.status(200).json({ user: userObj });
    } catch (error) {
        console.error("Failed login:", error.message);

        const status = error.message.includes("audience") ? 401 : 400;
        return res
            .status(status)
            .json({ message: error.message || "Authentication error" });
    }
});

export default app;
