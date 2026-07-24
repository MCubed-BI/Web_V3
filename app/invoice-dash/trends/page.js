"use client";
import { useEffect, useState } from "react";
import ChartContainer from "@/components/ChartContainer";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function InvoiceTrends() {
  const [sales, setSales] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/sales?year=${year}`)
      .then((r) => r.json())
      .then((d) => setSales(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  if (loading) return <div className="loading">Loading Trends...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Invoice Trends</h1>
        <div className="filter-bar">
          <select value={year} onChange={(e) => setYear(+e.target.value)}>
            {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="charts-row">
        <ChartContainer title="Monthly Sales vs GP">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis dataKey="month_num" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"} />
              <Tooltip formatter={(v) => "$" + Number(v).toLocaleString()} contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e" }} />
              <Legend />
              <Bar dataKey="total_sales" fill="#c2185b" name="Sales" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gross_profit" fill="#4caf50" name="Gross Profit" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total_cost" fill="#ff9800" name="Cost" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="GP % Trend">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sales.map((s) => ({ ...s, gp_pct_calc: s.total_sales > 0 ? ((s.gross_profit / s.total_sales) * 100).toFixed(1) : 0 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis dataKey="month_num" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(v) => v + "%"} />
              <Tooltip formatter={(v) => v + "%"} contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e" }} />
              <Bar dataKey="gp_pct_calc" fill="#7c4dff" name="GP %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}