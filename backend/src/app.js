import express from "express";
import cors from "cors";
import User from "./models/User.js"
import incomeRouter from "./routes/income.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use("/api/income", incomeRouter)


// Google Client ID
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
// URI to verify the Google Account ID.
const GOOGLE_TOKEN_VERIFICATION_URL = process.env.GOOGLE_TOKEN_VERIFICATION_URL;


// Test route
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "SpendSmart Backend" });
});

/*
This function is used to verify the user token ID using the Google Verification.
 */
const verifyGoogleToken = async (token) => {
    // Verify the user token with Google.
    const response = await fetch(`${GOOGLE_TOKEN_VERIFICATION_URL}${encodeURIComponent(token)}`);

    // If bad response throw error
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    // Create a payload of the response
    const payload = await response.json();

    // If the AUD_ID in the payload is not equal to the Google Client ID return error
    if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
        throw new Error("Token audience does not match credentials");
    }

    // Compute the expiry time.
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
        throw new Error("Token expired");
    }

    // Return the payload.
    return payload;
}

app.post("/auth/google", async (req, res) => {
    const { credentials } = req.body || {};
    if (!credentials || !credentials) {
        return res.status(400).json({ status: "Google Credentials are required." });
    }


    try {
        const googleProfile = await verifyGoogleToken(credentials);

        let user = await User.findOne({ googleId: googleProfile.sub});

        if (!user) {
            user = await User.create({
                googleId: googleProfile.sub,
                name: googleProfile.name,
                email: googleProfile.email,
                picture: googleProfile.picture,
            })
            if (user) {
                console.log("User Created.")
            }
        }
         // Return the MongoDB User ID for internal Reference.
        const userObj = {
            id: user._id,
            email: googleProfile.email,
            name: googleProfile.name,
            picture: googleProfile.picture,
            expiresAt: googleProfile.exp,
        }
        console.log("User Successfully Logged In.");
        return res.status(200).json({userObj, credentials});
    } catch (error) {
        console.log("Failed to Log In.")
        const status = error.message.includes("audience") ? 401 : 400;
        res.status(status).json({message: error.message || "Authentication error"});
    }
})


export default app;
