import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts";

export default function IncomeExpenseLineChart({ userId, month, year }) {
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [labels, setLabels] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI;

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(
                    `${apiBaseUrl}/api/transactions/monthlyTransactions?userId=${userId}&month=${month}&year=${year}`
                );
                const data = await res.json();

                const daysInMonth = new Date(year, month, 0).getDate();

                const income = Array(daysInMonth).fill(0);
                const expense = Array(daysInMonth).fill(0);

                const ordinal = (n) => {
                    const rem10 = n % 10;
                    const rem100 = n % 100;
                    if (rem10 === 1 && rem100 !== 11) return `${n}st`;
                    if (rem10 === 2 && rem100 !== 12) return `${n}nd`;
                    if (rem10 === 3 && rem100 !== 13) return `${n}rd`;
                    return `${n}th`;
                };
                const xLabels = Array.from({ length: daysInMonth }, (_, i) => ordinal(i + 1));

                data.transactions.forEach(t => {
                    const day = new Date(t.date).getDate() - 1;
                    if (t.type === "income") income[day] += t.amount;
                    else expense[day] += t.amount;
                });

                setIncomeData(income);
                setExpenseData(expense);
                setLabels(xLabels);

            } catch (err) {
                console.error("Error fetching trend data:", err);
            }
        }

        fetchData();
    }, [userId, month, year]);

    return (
        <Box sx={{ width: "100%", height: 300 }}>
            <LineChart
                series={[
                    { data: incomeData, label: "Income" },
                    { data: expenseData, label: "Expense" },
                ]}
                xAxis={[
                    { scaleType: "point", data: labels }
                ]}
                yAxis={[{ width: 50 }]}
                margin={{ right: 24 }}

                // 🌟 ALL TEXT WHITE
                sx={{
                    "& text": { fill: "#ffffff",  },

                    // Axis labels
                    "& .MuiChartsAxis-label": { fill: "#ffffff", color:"#ffffff"},
                    "& .MuiChartsAxis-tickLabel": { fill: "#ffffff", color:"#ffffff" },

                    // Legend labels
                    "& .MuiChartsLegend-label": { fill: "#ffffff", color:"#ffffff" },

                    // Tooltip text
                    "& .MuiChartsTooltip-root": {
                        color: "#ffffff",
                    },
                    "& .MuiChartsTooltip-paper": {
                        backgroundColor: "#0f172a", // dark background (optional)
                        color: "#ffffff",
                    },
                    "& .MuiChartsAxis-line": {
                        stroke: "#ffffff",
                    },
                    "& .MuiChartsAxis-tick": {
                        stroke: "#ffffff",
                    },

                }}
            />
        </Box>
    );
}
