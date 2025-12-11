import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts";

export default function DailyCashflowAreaChart({ userId, month, year }) {
    const [dailyData, setDailyData] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI;

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            console.log('here')
            const res = await fetch(
                `${apiBaseUrl}/api/transactions/dailyCashflow?userId=${userId}&month=${month}&year=${year}`
            );

            const data = await res.json();
            console.log(data);
            setDailyData(data.daily || []);
        };

        fetchData();
    }, [userId, month, year]);

    if (dailyData.length === 0) {
        return <p style={{ color: "#9aa5c1" }}>No daily cashflow data available.</p>;
    }

    const days = dailyData.map((d) => d.day);
    const netValues = dailyData.map((d) => d.net); // income - expense

    const minY = Math.min(...netValues, 0);
    const maxY = Math.max(...netValues, 0);

    return (
        <Box sx={{ width: "100%", height: 320 }}>
            <LineChart
                xAxis={[
                    {
                        scaleType: "point",
                        data: days,
                        tickLabelStyle: { fill: "#ffffff" },
                        labelStyle: { fill: "#ffffff" },
                        slotProps: {
                            axisLine: { stroke: "#ffffff" },
                            axisTick: { stroke: "#ffffff" },
                        },
                    },
                ]}
                yAxis={[
                    {
                        min: minY,
                        max: maxY,
                        tickLabelStyle: { fill: "#ffffff" },
                        labelStyle: { fill: "#ffffff" },
                        slotProps: {
                            axisLine: { stroke: "#ffffff" },
                            axisTick: { stroke: "#ffffff" },
                        },
                    }
                ]}
                series={[
                    {
                        data: netValues,
                        label: "Net Cashflow",
                        area: true, // <----- MAKES AREA CHART
                        color: "#e477ce",
                        baseline: 0,
                    },
                ]}
                tooltip
                grid={{ horizontal: true }}
                height={300}
                slotProps={{
                    legend: {
                        labelStyle: { fill: "#ffffff", color: "#ffffff" },
                    },
                }}
                sx={{
                    "& text": { fill: "#ffffff" },
                    "& .MuiChartsAxis-label": { fill: "#ffffff", color: "#ffffff" },
                    "& .MuiChartsAxis-tickLabel": { fill: "#ffffff", color: "#ffffff" },
                    "& .MuiChartsAxis-line": { stroke: "#ffffff" },
                    "& .MuiChartsAxis-tick": { stroke: "#ffffff" },
                    "& .MuiChartsLegend-label": { fill: "#ffffff", color: "#ffffff" },
                }}
            />
        </Box>
    );
}
