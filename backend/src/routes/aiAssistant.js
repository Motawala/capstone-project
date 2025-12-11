import express from "express";
import OpenAI from "openai";
import { getMonthlyTransactions } from "../services/transactionService.js";

const aiRouter = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- helper to clean unwanted markdown ---
function sanitizeAIResponse(text) {
    return text
        .trim()
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
}


aiRouter.post("/ask", async (req, res) => {
    try {
        const { userId, month, year, prompt } = req.body;

        if (!userId || !prompt) {
            return res.status(400).json({ error: "userId and prompt are required" });
        }

        // ---------------------------------------------------------
        // 1️⃣ Fetch Data
        // ---------------------------------------------------------
        const transactions = await getMonthlyTransactions(userId, month, year);

        // Summaries
        let incomeTotal = 0;
        let expenseTotal = 0;

        const incomeBreakdown = {};
        const expenseBreakdown = {};

        transactions.forEach(t => {
            if (t.type === "income") {
                incomeTotal += t.amount;
                incomeBreakdown[t.category] = (incomeBreakdown[t.category] || 0) + t.amount;
            } else {
                expenseTotal += t.amount;
                expenseBreakdown[t.category] = (expenseBreakdown[t.category] || 0) + t.amount;
            }
        });

        const netCashFlow = incomeTotal - expenseTotal;

        // ---------------------------------------------------------
        // 2️⃣ AI SYSTEM MESSAGE (STRONG, STRUCTURED, JSON-ENFORCING)
        // ---------------------------------------------------------
        const systemInstruction = `
            You are a financial analytics assistant.
            
            You MUST ALWAYS reply in **valid JSON**, following this structure exactly:
            
            {
              "summary": "Short high-level overview.",
              "income": {
                "total": number,
                "breakdown": { "category": number }
              },
              "expenses": {
                "total": number,
                "breakdown": { "category": number }
              },
              "netCashFlow": number,
              "takeaways": [ "bullet point insight", "bullet point insight" ],
              "projection": {
                "baseline": number,
                "scenarios": {
                    "scenarioA": "text",
                    "scenarioB": "text",
                    "scenarioC": "text"
                }
              }
            }
            
            RULES:
            - NEVER hallucinate numbers.
            - Only use values from the provided dataset.
            - If something is missing, note it in takeaways.
            - The JSON must parse without errors.
            - Keep answers concise but insightful.
            `
        ;

        // ---------------------------------------------------------
        // 3️⃣ Send request to OpenAI
        // ---------------------------------------------------------
        const aiResponse = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `
                        You are a financial analytics assistant.
                        
                        You MUST ALWAYS reply in **raw JSON ONLY**, never text, never markdown.
                        
                        STRICT RULES:
                        - Do NOT wrap JSON in \`\`\`.
                        - Do NOT write "Here is JSON" or any other explanation.
                        - Output MUST be a valid JSON object.
                        - Use only numbers from the provided summary.
                        - If uncertain, return null fields but KEEP VALID JSON FORMAT.
                        
                        Your JSON structure to follow:
                        
                        {
                          "summary": "",
                          "income": {
                            "total": 0,
                            "breakdown": {}
                          },
                          "expenses": {
                            "total": 0,
                            "breakdown": {}
                          },
                          "netCashFlow": 0,
                          "takeaways": [],
                          "projection": {
                              "baseline": 0,
                              "scenarios": {
                                "scenarioA": "",
                                "scenarioB": "",
                                "scenarioC": ""
                              }
                          }
                        }
                    `
                },
                {
                    role: "user",
                    content: `
                        User Query: ${prompt}
                        
                        Here is the monthly financial summary:
                        - Total Income: ${incomeTotal}
                        - Income Breakdown: ${JSON.stringify(incomeBreakdown)}
                        - Total Expenses: ${expenseTotal}
                        - Expense Breakdown: ${JSON.stringify(expenseBreakdown)}
                        - Net Cash Flow: ${netCashFlow}
                        
                        Return JSON ONLY.
                        `
                }
            ],
            temperature: 0.2,
        });

        // extract message
        const raw = aiResponse.choices[0].message.content;

        // sanitize markdown fences
        const clean = sanitizeAIResponse(raw);

        // debug output
        console.log("CLEAN AI JSON:", clean);

        // parse JSON
        const parsed = JSON.parse(clean);

        res.json(parsed);


    } catch (error) {
        console.error("AI Error:", error);

        res.status(500).json({
            error: error.message,
            note: "The AI response could not be parsed into JSON."
        });
    }
});

export default aiRouter;
