// src/components/dashboard/CategorySpendingChart.jsx
import { useEffect, useRef, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

const StyledText = styled("text")(() => ({
    fill: "#ffffff",
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 22,
    fontWeight: 700,
}));

function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
        </StyledText>
    );
}

export default function CategoryPieChart({ userId, month, year }) {
    const [categoryData, setCategoryData] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI;
    const containerRef = useRef(null);
    const [chartSize, setChartSize] = useState({ width: 320, height: 260 });

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            const res = await fetch(
                `${apiBaseUrl}/api/transactions/monthlyTransactions?userId=${userId}&month=${month}&year=${year}`
            );

            const data = await res.json();

            const grouped = {};
            data.transactions?.forEach((t) => {
                if (t.type === "expense") {
                    grouped[t.category] = (grouped[t.category] || 0) + t.amount;
                }
            });

            const formatted = Object.entries(grouped).map(([label, value]) => ({
                label,
                value,
            }));

            setCategoryData(formatted);
        };

        fetchData();
    }, [userId, month, year]);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            const width = entry.contentRect.width || 320;
            const height = Math.min(Math.max(width * 0.7, 220), 360); // responsive, bounded
            setChartSize({ width, height });
        });

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    if (categoryData.length === 0) {
        return <p style={{ color: "#ffffff90" }}>No expense data for this month.</p>;
    }

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#ffffff90", fill:"#ffffff" }}>
            <PieChart
                series={[
                    {
                        data: categoryData,
                        innerRadius: Math.max(60, Math.min(chartSize.width, chartSize.height) * 0.2),
                        outerRadius: Math.max(
                            90,
                            Math.min((Math.min(chartSize.width, chartSize.height) / 2) - 20, 150)
                        ),
                        paddingAngle: 3,
                        labelColor: "#ffffff",
                        labelStyle: { fill: "#ffffff", color: "#ffffff", fontSize: 12, fontWeight: 600 },
                    },
                ]}
                slotProps={{
                    legend: {
                        labelStyle: {
                            fill: "#ffffff",
                            color: "#ffffff",
                            fontSize: 14,
                            fontWeight: 600,
                        },
                        fill: "#ffffff",
                    },
                }}
                sx={{
                    "& text": { fill: "#ffffff" },
                    "& .MuiChartsLegend-label": { fill: "#ffffff", color: "#ffffff" },
                    "& .MuiChartsLegend-series text": { fill: "#ffffff", color: "#ffffff" },
                }}
                width={chartSize.width}
                height={chartSize.height}
            >
                <PieCenterLabel>Category</PieCenterLabel>
            </PieChart>
        </div>
    );
}
