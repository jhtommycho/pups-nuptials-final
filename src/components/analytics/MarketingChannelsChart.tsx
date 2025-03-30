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

interface MarketingChannelsChartProps {
  requests: any[]; // Using any[] since the actual type includes relations
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const MarketingChannelsChart: React.FC<MarketingChannelsChartProps> = ({
  requests,
}) => {
  const chartData = useMemo(() => {
    if (!requests || requests.length === 0) {
      return [];
    }

    const marketingCounts: Record<string, number> = {};

    requests.forEach((request) => {
      if (!request.marketing) return;

      // Format the marketing channel name for display
      const channel = request.marketing
        .replace(/_/g, " ")
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      marketingCounts[channel] = (marketingCounts[channel] || 0) + 1;
    });

    // Convert to array format for PieChart
    return Object.entries(marketingCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by count descending
  }, [requests]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        No marketing data available
      </div>
    );
  }

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

export default MarketingChannelsChart;
