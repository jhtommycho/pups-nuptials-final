"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ServiceStatus } from "@prisma/client";

interface RequestsStatusChartProps {
  requests: any[]; // Using any[] since the actual type includes relations
}

const STATUS_COLORS = {
  PENDING: "#FFBB28",
  APPROVED: "#00C49F",
  REJECTED: "#FF8042",
  COMPLETED: "#0088FE",
};

const RequestsStatusChart: React.FC<RequestsStatusChartProps> = ({
  requests,
}) => {
  const chartData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      COMPLETED: 0,
    };

    requests.forEach((request) => {
      const status = request.status || "PENDING";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Convert to array format for BarChart
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase(),
      value,
    }));
  }, [requests]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="value"
          name="Number of Requests"
          fill="#8884d8"
          // @ts-ignore - recharts typing issue
          fill={(entry) => STATUS_COLORS[entry.name.toUpperCase()]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RequestsStatusChart;
