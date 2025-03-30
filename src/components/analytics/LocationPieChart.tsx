"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface LocationPieChartProps {
  requests: any[]; // Using any[] since the actual type includes relations
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

const LocationPieChart: React.FC<LocationPieChartProps> = ({ requests }) => {
  const chartData = useMemo(() => {
    const locationCounts: Record<string, number> = {}; // Record<KeyType, ValueType>

    requests.forEach((request) => {
      const location = request.weddingCity || "Unknown";
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    // Convert to array format for PieChart
    return Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by count descending
  }, [requests]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} requests`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LocationPieChart;
