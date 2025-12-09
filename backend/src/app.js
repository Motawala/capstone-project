import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_TOKEN_VERIFICATION_URL = process.env.GOOGLE_TOKEN_VERIFICATION_URL;


// Test route
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "SpendSmart Backend" });
});

const verifyGoogleToken = async (token) => {
    // Verify the user token with Google.
    const response = await fetch(`${GOOGLE_TOKEN_VERIFICATION_URL}${encodeURIComponent(token)}`);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const payload = await response.json();

    if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
        throw new Error("Token audience does not match credentials");
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
        throw new Error("Token expired");
    }


    return payload;
}

app.post("/auth/google", async (req, res) => {
    const { credentials } = req.body || {};
    if (!credentials || !credentials) {
        return res.status(400).json({ status: "Google Credentials are required." });
    }

    try {
        const googleProfile = await verifyGoogleToken(credentials);
        const user = {
            id: googleProfile.sub,
            email: googleProfile.email,
            name: googleProfile.name,
            picture: googleProfile.picture,
            expiresAt: googleProfile.exp,
        }
        console.log("User Successfully Logged In.");
        return res.status(200).json({user, credentials});
    } catch (error) {
        console.log("Failed to Log In.")
        const status = error.message.includes("audience") ? 401 : 400;
        res.status(status).json({message: error.message || "Authentication error"});
    }
})


export default app;
