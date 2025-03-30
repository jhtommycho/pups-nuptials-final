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
import { Service } from "@prisma/client";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
} from "date-fns";

interface RequestsBarChartProps {
  requests: any[]; // Using any[] since the actual type includes relations
}

const RequestsBarChart: React.FC<RequestsBarChartProps> = ({ requests }) => {
  const chartData = useMemo(() => {
    if (!requests || requests.length === 0) {
      return Array(6)
        .fill(0)
        .map((_, i) => {
          const weekStart = startOfWeek(subWeeks(new Date(), 5 - i));
          return {
            week: `${format(weekStart, "MMM d")}`,
            requests: 0,
          };
        });
    }

    // Get current week and previous 5 weeks
    const today = new Date();
    const weeks = Array.from({ length: 6 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(today, 5 - i));
      const weekEnd = endOfWeek(weekStart);
      return {
        start: weekStart,
        end: weekEnd,
        label: `${format(weekStart, "MMM d")}`,
      };
    });

    // Count requests per week
    return weeks.map((week) => {
      const count = requests.filter((req) => {
        if (!req.createdAt) return false;
        const requestDate = new Date(req.createdAt);
        return requestDate >= week.start && requestDate <= week.end;
      }).length;

      return {
        week: week.label,
        requests: count,
      };
    });
  }, [requests]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="week"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12 }}
        />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="requests" fill="#8884d8" name="Service Requests" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RequestsBarChart;
