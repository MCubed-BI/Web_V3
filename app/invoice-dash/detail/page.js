"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import ChartContainer from "@/components/ChartContainer";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function InvoiceDetail() {
  const [invoices, setInvoices] = useState([]);
  const [sales, setSales] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/invoices?year=${year}&month=${month}`).then((r) => r.json()),
      fetch(`/api/sales?year=${year}`).then((r) => r.json()),
    ])
      .then(([inv, s]) => {
        setInvoices(Array.isArray(inv) ? inv : []);
        setSales(Array.isArray(s) ? s : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, month]);

  const invoiceCols = [
    { key: "invoice_no", label: "Invoice #" },
    { key: "invoice_date", label: "Date", format: "date" },
    { key: "customer_name", label: "Customer" },
    { key: "total_amount", label: "Amount", format: "currency" },
    { key: "gross_profit", label: "GP", format: "currency" },
  ];

  if (loading) return <div className="loading">Loading Invoice Detail...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Invoice Detail</h1>
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

      <ChartContainer title="Key Metrics Over Time">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="month_num" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e" }} />
            <Legend />
            <Line type="monotone" dataKey="total_sales" stroke="#c2185b" name="Sales" />
            <Line type="monotone" dataKey="gross_profit" stroke="#4caf50" name="GP" />
            <Line type="monotone" dataKey="total_cost" stroke="#ff9800" name="Cost" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="table-section">
        <h2>Invoice List</h2>
        <DataTable columns={invoiceCols} data={invoices} pageSize={20} />
      </div>
    </div>
  );
}