"use client";
import { useEffect, useState } from "react";
import ChartContainer from "@/components/ChartContainer";
import DataTable from "@/components/DataTable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function StateBreakdown() {
  const [customers, setCustomers] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/customers?year=${year}`)
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        const byState = {};
        arr.forEach((c) => {
          const st = c.state || "Unknown";
          if (!byState[st]) byState[st] = { state: st, total_sales: 0, customer_count: 0 };
          byState[st].total_sales += Number(c.total_sales || 0);
          byState[st].customer_count += 1;
        });
        const result = Object.values(byState).sort((a, b) => b.total_sales - a.total_sales);
        setCustomers(result);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  const cols = [
    { key: "state", label: "State" },
    { key: "total_sales", label: "Total Sales", format: "currency" },
    { key: "customer_count", label: "Customers", format: "number" },
  ];

  if (loading) return <div className="loading">Loading State Breakdown...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Sales by State</h1>
        <div className="filter-bar">
          <select value={year} onChange={(e) => setYear(+e.target.value)}>
            {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <ChartContainer title="Sales by State">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={customers.slice(0, 20)} layout="vertical" margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis type="number" stroke="#888" tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"} />
            <YAxis type="category" dataKey="state" stroke="#888" width={50} />
            <Tooltip formatter={(v) => "$" + Number(v).toLocaleString()} contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e" }} />
            <Bar dataKey="total_sales" fill="#2196f3" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="table-section">
        <h2>State Detail</h2>
        <DataTable columns={cols} data={customers} />
      </div>
    </div>
  );
}