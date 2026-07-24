"use client";
import { useEffect, useState } from "react";
import ChartContainer from "@/components/ChartContainer";
import DataTable from "@/components/DataTable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        arr.sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0));
        setProducts(arr.slice(0, 10));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, month]);

  const cols = [
    { key: "sodline_prod_ln", label: "Product Line" },
    { key: "total_sales", label: "Sales", format: "currency" },
    { key: "total_qty", label: "Qty", format: "number" },
    { key: "avg_price", label: "Avg Price", format: "currency" },
    { key: "order_count", label: "Orders", format: "number" },
  ];

  if (loading) return <div className="loading">Loading Top Products...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Top 10 Product Lines</h1>
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

      <ChartContainer title="Top 10 Product Lines by Sales">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={products} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis type="number" stroke="#888" tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"} />
            <YAxis type="category" dataKey="sodline_prod_ln" stroke="#888" width={110} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => "$" + Number(v).toLocaleString()} contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e" }} />
            <Bar dataKey="total_sales" fill="#4caf50" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="table-section">
        <h2>Product Line Detail</h2>
        <DataTable columns={cols} data={products} />
      </div>
    </div>
  );
}