import React, { useEffect, useState } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import styles from "../../pages/dashboard.module.css";

export default function SpendingHeatmap({ userId, month, year }) {
    const [dailyTotals, setDailyTotals] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI;

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(
                `${apiBaseUrl}/api/transactions/monthlyTransactions?userId=${userId}&month=${month}&year=${year}`
            );
            const data = await res.json();

            const daysInMonth = new Date(year, month, 0).getDate();
            const totals = Array(daysInMonth).fill(0);

            data.transactions.forEach((txn) => {
                if (txn.type === "expense") {
                    const day = new Date(txn.date).getDate() - 1;
                    totals[day] += txn.amount;
                }
            });

            setDailyTotals(totals);
        }

        fetchData();
    }, [userId, month, year]);

    const max = Math.max(...dailyTotals, 0);
    const mid = max * 0.5;

    const getColor = (value) => {
        if (value === 0) return "#1e293b";
        if (value < mid) return "#eab308";
        return "#ef4444";
    };

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = dailyTotals.length;

    const cells = [];

    for (let i = 0; i < firstDay; i++) {
        cells.push(<Box key={`blank-${i}`} sx={{ width: 40, height: 40 }} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const spending = dailyTotals[d - 1];

        cells.push(
            <Tooltip
                key={`day-${d}`}
                title={`Day ${d}: $${spending.toFixed(2)}`}
                placement="top"
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: getColor(spending),
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "0.2s",
                        "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0px 0px 6px rgba(255,255,255,0.4)",
                        },
                    }}
                >
                    {d}
                </Box>
            </Tooltip>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            {/* FLEX CONTAINER: Calendar LEFT | Legend RIGHT */}
            <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>

                {/* 📅 CALENDAR GRID */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 40px)",
                        gap: 1,
                    }}
                >
                    {cells}
                </Box>

                {/* 🎨 LEGEND ON THE RIGHT */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Typography sx={{ color: "white", fontSize: "0.9rem", fontWeight: 600 }}>
                        Legend
                    </Typography>

                    {/* Low */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 22, height: 22, borderRadius: "4px", background: "#1e293b" }} />
                        <Typography sx={{ color: "white", fontSize: "0.85rem" }}>
                            Low ($0)
                        </Typography>
                    </Box>

                    {/* Medium */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 22, height: 22, borderRadius: "4px", background: "#eab308" }} />
                        <Typography sx={{ color: "white", fontSize: "0.85rem" }}>
                            Medium (&lt; ${(mid || 0).toFixed(2)})
                        </Typography>
                    </Box>

                    {/* High */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 22, height: 22, borderRadius: "4px", background: "#ef4444" }} />
                        <Typography sx={{ color: "white", fontSize: "0.85rem" }}>
                            High (&ge; ${(mid || 0).toFixed(2)})
                        </Typography>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}
