"use client";
import { useEffect, useState } from "react";
import KPICard from "@/components/KPICard";
import ChartContainer from "@/components/ChartContainer";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";

export default function InvoiceOverview() {
  const [kpis, setKpis] = useState(null);
  const [sales, setSales] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/kpis?year=${year}&month=${month}`).then((r) => r.json()),
      fetch(`/api/sales?year=${year}`).then((r) => r.json()),
    ])
      .then(([k, s]) => {
        setKpis(k);
        setSales(Array.isArray(s) ? s : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, month]);

  const fmt = (v) =>
    v != null ? "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 0 }) : "—";
  const pct = (v) => (v != null ? Number(v).toFixed(1) + "%" : "—");

  if (loading) return <div className="loading">Loading Invoice Overview...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Invoice Overview</h1>
        <div className="filter-bar">
          <select value={year} onChange={(e) => setYear(+e.target.value)}>
            {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={month} onChange={(e) => setMonth(+e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        <KPICard title="Total Sales" value={fmt(kpis?.total_sales)} trend="up" />
        <KPICard title="Gross Profit" value={fmt(kpis?.gross_profit)} trend="up" />
        <KPICard title="GP %" value={pct(kpis?.gp_pct)} trend={kpis?.gp_pct > 30 ? "up" : "down"} />
        <KPICard title="Invoice Count" value={kpis?.invoice_count ?? "—"} />
        <KPICard title="Avg Order Value" value={fmt(kpis?.avg_order_value)} />
      </div>

      <div className="charts-row">
        <ChartContainer title="Sales Trend by Month">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis dataKey="month_num" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"} />
              <Tooltip formatter={(v) => "$" + Number(v).toLocaleString()} contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e" }} />
              <Bar dataKey="total_sales" fill="#c2185b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gross_profit" fill="#4caf50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Revenue Trend">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis dataKey="month_num" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"} />
              <Tooltip formatter={(v) => "$" + Number(v).toLocaleString()} contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e" }} />
              <Area type="monotone" dataKey="total_sales" stroke="#c2185b" fill="rgba(194,24,91,0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}