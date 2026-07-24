'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import KPICard from '@/components/KPICard';
import DataTable from '@/components/DataTable';
import ChartContainer from '@/components/ChartContainer';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 42000, orders: 312 },
  { month: 'Feb', revenue: 38500, orders: 287 },
  { month: 'Mar', revenue: 51200, orders: 390 },
  { month: 'Apr', revenue: 47800, orders: 348 },
  { month: 'May', revenue: 53100, orders: 412 },
  { month: 'Jun', revenue: 61500, orders: 475 },
  { month: 'Jul', revenue: 58900, orders: 451 },
  { month: 'Aug', revenue: 64200, orders: 498 },
  { month: 'Sep', revenue: 59800, orders: 463 },
  { month: 'Oct', revenue: 67100, orders: 521 },
  { month: 'Nov', revenue: 72400, orders: 568 },
  { month: 'Dec', revenue: 78900, orders: 612 },
];

const categoryData = [
  { name: 'Hardware', value: 35 },
  { name: 'Software', value: 28 },
  { name: 'Services', value: 22 },
  { name: 'Support', value: 15 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const topCustomers = [
  { id: 1, name: 'Acme Corp', region: 'Midwest', orders: 87, total: '$124,500' },
  { id: 2, name: 'GlobalTech', region: 'Southeast', orders: 72, total: '$98,200' },
  { id: 3, name: 'Pinnacle Inc', region: 'Northeast', orders: 64, total: '$87,600' },
  { id: 4, name: 'Summit LLC', region: 'West', orders: 58, total: '$76,300' },
  { id: 5, name: 'Evergreen Dist', region: 'Midwest', orders: 51, total: '$65,800' },
  { id: 6, name: 'MetroSupply', region: 'Northeast', orders: 47, total: '$59,100' },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">DDI Analytics Dashboard</h1>
            <p className="text-slate-500 mt-1">Tenant: MCubed BI — Last sync: Today at 6:00 AM</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Revenue"
              value="$695,400"
              change="+12.4%"
              trend="up"
              subtitle="vs. prior year"
            />
            <KPICard
              title="Active Customers"
              value="342"
              change="+8.1%"
              trend="up"
              subtitle="this quarter"
            />
            <KPICard
              title="Orders YTD"
              value="5,137"
              change="+15.2%"
              trend="up"
              subtitle="year to date"
            />
            <KPICard
              title="Avg Order Value"
              value="$135.37"
              change="-2.3%"
              trend="down"
              subtitle="vs. last quarter"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ChartContainer title="Monthly Revenue" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Revenue by Category">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Orders Trend */}
          <div className="mb-8">
            <ChartContainer title="Orders Trend">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Top Customers Table */}
          <DataTable
            title="Top Customers"
            columns={['Customer', 'Region', 'Orders', 'Total']}
            rows={topCustomers.map((c) => [c.name, c.region, c.orders, c.total])}
          />
        </div>
      </main>
    </div>
  );
}
