"use client";
import { useEffect, useState } from "react";
import ChartContainer from "@/components/ChartContainer";
import DataTable from "@/components/DataTable";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#c2185b", "#4caf50", "#2196f3", "#ff9800", "#7c4dff", "#00bcd4", "#f44336", "#8bc34a"];

export default function ShipVia() {
  const [invoices, setInvoices] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/invoices?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        const byShip = {};
        arr.forEach((inv) => {
          const sv = inv.ship_via || inv.ship_method || "Unknown";
          if (!byShip[sv]) byShip[sv] = { name: sv, count: 0, total: 0 };
          byShip[sv].count += 1;
          byShip[sv].total += Number(inv.total_amount || 0);
        });
        setInvoices(Object.values(byShip).sort((a, b) => b.total - a.total));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, month]);

  const cols = [
    { key: "name", label: "Ship Via" },
    { key: "count", label: "Invoices", format: "number" },
    { key: "total", label: "Total Sales", format: "currency" },
  ];

  if (loading) return <div className="loading">Loading Ship Via...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Ship Via Breakdown</h1>
        <div className="filter-bar">
          <select value={year} onChange={(e) => setYear(+e.target.value)}>
            {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={month} onChange={(e) => setMonth(+e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString("en", { month: "long" })}</option>
            ))}
          </select>
        </div>
      </div>

      <ChartContainer title="Ship Via Distribution">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie data={invoices} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={140} innerRadius={80} label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"}>
              {invoices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => "$" + Number(v).toLocaleString()} contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="table-section">
        <h2>Ship Via Detail</h2>
        <DataTable columns={cols} data={invoices} />
      </div>
    </div>
  );
}