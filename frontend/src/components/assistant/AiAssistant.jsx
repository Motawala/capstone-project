import { useEffect, useRef, useState } from "react";
import styles from "../../pages/dashboard.module.css";

export default function AiAssistant({ userId, month, year }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            role: "assistant",
            text: "Hi, I am your Spend Smart copilot. Ask about spending trends, forecasts, or saving ideas for this month.",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI;
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const sendPrompt = async () => {
        const prompt = input.trim();
        if (!prompt || isLoading) return;

        const userMessage = { id: `user-${Date.now()}`, role: "user", text: prompt };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch(`${apiBaseUrl}/api/ai/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, month, year, prompt }),
            });

            const data = await res.json();

            let formattedMessage;

            // ---- 🎯 CASE 1: Structured JSON response ----
            if (data.summary || data.income || data.expenses) {
                formattedMessage = {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    json: data,   // <-- store entire JSON object
                };
            }
            // ---- 🎯 CASE 2: Fallback to text ----
            else {
                formattedMessage = {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    text: data.answer ?? "I could not generate a reply.",
                };
            }

            setMessages((prev) => [...prev, formattedMessage]);

        } catch (err) {
            console.error("Error fetching AI response:", err);
            setMessages((prev) => [
                ...prev,
                {
                    id: `assistant-error-${Date.now()}`,
                    role: "assistant",
                    text: "I hit a snag while responding. Please try again in a moment.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendPrompt();
        }
    };

    const quickPrompts = [
        "Summarize my top 3 spending categories this month.",
        "Project my balance for next month given current trends.",
        "Create a weekly budget outline from my transactions.",
    ];

    // ----------------------------------------------------------
    // 🎨 RENDER JSON IN NICE FORMAT
    // ----------------------------------------------------------
    const renderJsonResponse = (obj) => {
        if (!obj) return null;

        return (
            <div className={styles.aiJsonCard}>

                {obj.summary && (
                    <>
                        <h4>📌 Summary</h4>
                        <p>{obj.summary}</p>
                    </>
                )}

                {obj.income && (
                    <>
                        <h4>💰 Income</h4>
                        <p><strong>Total:</strong> ${obj.income.total?.toLocaleString()}</p>
                        <ul>
                            {obj.income.breakdown &&
                                Object.entries(obj.income.breakdown).map(([k, v]) => (
                                    <li key={k}>{k}: ${v.toLocaleString()}</li>
                                ))}
                        </ul>
                    </>
                )}

                {obj.expenses && (
                    <>
                        <h4>💸 Expenses</h4>
                        <p><strong>Total:</strong> ${obj.expenses.total?.toLocaleString()}</p>
                        <ul>
                            {obj.expenses.breakdown &&
                                Object.entries(obj.expenses.breakdown).map(([k, v]) => (
                                    <li key={k}>{k}: ${v.toLocaleString()}</li>
                                ))}
                        </ul>
                    </>
                )}

                {obj.netCashFlow !== undefined && (
                    <>
                        <h4>📊 Net Cash Flow</h4>
                        <p
                            style={{
                                color: obj.netCashFlow >= 0 ? "#22c55e" : "#ef4444",
                                fontWeight: "bold",
                            }}
                        >
                            {obj.netCashFlow >= 0 ? "+" : "-"}${Math.abs(obj.netCashFlow).toLocaleString()}
                        </p>
                    </>
                )}

                {obj.takeaways && obj.takeaways.length > 0 && (
                    <>
                        <h4>🔍 Key Takeaways</h4>
                        <ul>
                            {obj.takeaways.map((t, i) => (
                                <li key={i}>{t}</li>
                            ))}
                        </ul>
                    </>
                )}

                {obj.projection && (
                    <>
                        <h4>📅 Projection</h4>
                        <p><strong>Baseline:</strong> ${obj.projection.baseline?.toLocaleString()}</p>

                        {obj.projection.scenarios && (
                            <ul>
                                {Object.entries(obj.projection.scenarios).map(([k, v]) => (
                                    <li key={k}><b>{k}</b>: {v}</li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        );
    };

    // ----------------------------------------------------------
    // 🎨 MAIN RENDER
    // ----------------------------------------------------------
    return (
        <div className={styles.aiShell}>
            {/* Header */}
            <div className={styles.aiHeaderRow}>
                <div className={styles.aiHeroText}>
                    <div className={styles.aiBadge}>AI</div>
                    <div>
                        <h2 className={styles.aiTitle}>Spend Smart Copilot</h2>
                        <p className={styles.aiSubtitle}>
                            Ask about spending, income, or projections for {month}/{year}.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick prompts */}
            <div className={styles.aiQuickRow}>
                {quickPrompts.map((prompt) => (
                    <button
                        key={prompt}
                        type="button"
                        className={styles.aiQuickButton}
                        onClick={() => setInput(prompt)}
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Chat Window */}
            <div className={styles.aiChatWindow}>
                <div className={styles.aiChatHeader}>
                    <div>
                        <p className={styles.aiKicker}>Live chat</p>
                        <h3 className={styles.aiSubheading}>Ask a question</h3>
                    </div>
                    <div className={styles.aiStatus}>
                        <span className={styles.aiStatusDot}></span>
                        <span>{isLoading ? "Generating" : "Ready"}</span>
                    </div>
                </div>

                <div className={styles.aiMessages}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.aiMessageRow} ${
                                message.role === "user"
                                    ? styles.aiMessageUser
                                    : styles.aiMessageAssistant
                            }`}
                        >
                            <div className={styles.aiAvatar}>
                                {message.role === "user" ? "You" : "AI"}
                            </div>

                            <div className={styles.aiBubble}>
                                <div className={styles.aiMessageMeta}>
                                    <span className={styles.aiAuthor}>
                                        {message.role === "user" ? "You" : "Assistant"}
                                    </span>
                                </div>

                                {/* If assistant returned JSON → format it nicely */}
                                {message.json ? (
                                    renderJsonResponse(message.json)
                                ) : (
                                    <p className={styles.aiMessageText}>{message.text}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className={`${styles.aiMessageRow} ${styles.aiMessageAssistant}`}>
                            <div className={styles.aiAvatar}>AI</div>
                            <div className={`${styles.aiBubble} ${styles.aiBubbleGhost}`}>
                                <div className={styles.aiPulseRow}>
                                    <span className={styles.aiPulse}></span>
                                    <span className={styles.aiPulse}></span>
                                    <span className={styles.aiPulse}></span>
                                </div>
                                <p className={styles.aiMessageText}>Thinking through your data...</p>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Input bar */}
            <div className={styles.aiInputBar}>
                <textarea
                    className={styles.aiTextarea}
                    placeholder="Type a message and press Enter to send."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                />
                <button
                    type="button"
                    className={styles.aiSendButton}
                    onClick={sendPrompt}
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
}
