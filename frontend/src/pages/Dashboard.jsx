import { useState } from "react";
import StatCard from "../components/dashboard/StatCard.jsx";
import ChartCard from "../components/dashboard/ChartCard.jsx";
import RevenueChart from "../components/dashboard/RevenueChart.jsx";
import TrendChart from "../components/dashboard/TrendChart.jsx";
import StatusChart from "../components/dashboard/StatusChart.jsx";
import TopClientsTable from "../components/dashboard/TopClientsTable.jsx";

function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // KPI Data
  const kpiData = {
    totalInvoices: 156,
    totalRevenue: 245000,
    totalPaid: 185000,
    totalOutstanding: 45000,
    totalOverdue: 15000,
    averageInvoiceValue: 1571.79,
  };

  // Revenue Chart Data
  const revenueData = [
    { date: "Week 1", revenue: 45000 },
    { date: "Week 2", revenue: 52000 },
    { date: "Week 3", revenue: 48000 },
    { date: "Week 4", revenue: 61000 },
    { date: "Week 5", revenue: 58000 },
  ];

  // Trend Chart Data (Paid vs Outstanding)
  const trendData = [
    { date: "Jan 1", paid: 35000, outstanding: 15000 },
    { date: "Jan 3", paid: 42000, outstanding: 18000 },
    { date: "Jan 5", paid: 48000, outstanding: 12000 },
    { date: "Jan 7", paid: 55000, outstanding: 10000 },
    { date: "Jan 9", paid: 60000, outstanding: 8000 },
  ];

  // Status Distribution Data
  const statusData = [
    { name: "Draft", value: 12 },
    { name: "Sent", value: 23 },
    { name: "Paid", value: 98 },
    { name: "Overdue", value: 15 },
    { name: "Cancelled", value: 8 },
  ];

  // Top Clients Data
  const topClients = [
    { id: 1, name: "Acme Corp", invoiceCount: 24, revenue: 125000 },
    { id: 2, name: "Tech Solutions Ltd", invoiceCount: 18, revenue: 89500 },
    { id: 3, name: "Global Industries", invoiceCount: 15, revenue: 78000 },
    { id: 4, name: "StartUp Inc", invoiceCount: 12, revenue: 56000 },
    { id: 5, name: "Enterprise Group", invoiceCount: 10, revenue: 45000 },
  ];

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of your invoicing metrics
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Invoices Issued"
          value={kpiData.totalInvoices}
          variant="default"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Revenue Invoiced"
          value={`$${kpiData.totalRevenue.toLocaleString()}`}
          variant="primary"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          trend={{ direction: "up", value: "+12.5%", label: "vs last period" }}
        />

        <StatCard
          title="Total Paid"
          value={`$${kpiData.totalPaid.toLocaleString()}`}
          variant="success"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Outstanding"
          value={`$${kpiData.totalOutstanding.toLocaleString()}`}
          variant="warning"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Overdue"
          value={`$${kpiData.totalOverdue.toLocaleString()}`}
          variant="danger"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
        />

        <StatCard
          title="Average Invoice Value"
          value={`$${kpiData.averageInvoiceValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          variant="default"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <ChartCard
          title="Revenue Over Time"
          action={
            <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>Week</option>
              <option>Month</option>
              <option>Quarter</option>
            </select>
          }
        >
          <RevenueChart data={revenueData} period={selectedPeriod} />
        </ChartCard>

        {/* Paid vs Outstanding Trend */}
        <ChartCard title="Paid vs Outstanding Trend">
          <TrendChart data={trendData} />
        </ChartCard>
      </div>

      {/* Status Distribution and Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <ChartCard title="Invoice Status Distribution">
          <StatusChart data={statusData} />
        </ChartCard>

        {/* Top Clients Table */}
        <ChartCard title="Top Clients by Revenue">
          <TopClientsTable clients={topClients} />
        </ChartCard>
      </div>
    </div>
  );
}

export default Dashboard;
