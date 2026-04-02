'use client';

import { useEffect, useState } from 'react';
import { bookingService } from '../../../services/bookingService';
import { busService } from '../../../services/busService';
import { firestoreService, COLLECTIONS } from '../../../lib/firestore';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminReports() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    cancelledBookings: 0,
    averageTicketPrice: 0,
    topRoutes: [] as any[],
    topBuses: [] as any[],
    dailyRevenue: [] as any[]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateReport();
  }, [dateRange]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const [bookings, buses, routes] = await Promise.all([
        bookingService.getAllBookings(),
        busService.getAllBuses(),
        firestoreService.getAll(COLLECTIONS.ROUTES)
      ]);

      // Filter bookings by date range
      const filteredBookings = bookings.filter((b: any) => {
        const bookingDate = new Date(b.bookingDate).toISOString().split('T')[0];
        return bookingDate >= dateRange.from && bookingDate <= dateRange.to;
      });

      // Calculate metrics
      const totalRevenue = filteredBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
      const cancelledBookings = filteredBookings.filter((b: any) => b.status === 'cancelled').length;
      const averageTicketPrice = filteredBookings.length > 0 ? totalRevenue / filteredBookings.length : 0;

      // Top routes by bookings
      const routeBookings = filteredBookings.reduce((acc: any, b: any) => {
        acc[b.routeId] = (acc[b.routeId] || 0) + 1;
        return acc;
      }, {});
      const topRoutes = Object.entries(routeBookings)
        .map(([routeId, count]) => {
          const route = routes.find((r: any) => r.id === routeId);
          return {
            name: route ? `${route.source} - ${route.destination}` : routeId,
            bookings: count
          };
        })
        .sort((a, b) => (b.bookings as number) - (a.bookings as number))
        .slice(0, 5);

      // Top buses by revenue
      const busRevenue = filteredBookings.reduce((acc: any, b: any) => {
        acc[b.busId] = (acc[b.busId] || 0) + (b.totalAmount || 0);
        return acc;
      }, {});
      const topBuses = Object.entries(busRevenue)
        .map(([busId, revenue]) => {
          const bus = buses.find((b: any) => b.id === busId);
          return {
            name: bus ? bus.name : busId,
            revenue: revenue
          };
        })
        .sort((a, b) => (b.revenue as number) - (a.revenue as number))
        .slice(0, 5);

      // Daily revenue
      const dailyData: any = {};
      filteredBookings.forEach((b: any) => {
        const date = new Date(b.bookingDate).toLocaleDateString();
        dailyData[date] = (dailyData[date] || 0) + (b.totalAmount || 0);
      });
      const dailyRevenue = Object.entries(dailyData).map(([date, revenue]) => ({
        date,
        revenue
      }));

      setReportData({
        totalRevenue,
        totalBookings: filteredBookings.length,
        cancelledBookings,
        averageTicketPrice,
        topRoutes,
        topBuses,
        dailyRevenue
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Revenue', `₹${reportData.totalRevenue}`],
      ['Total Bookings', reportData.totalBookings],
      ['Cancelled Bookings', reportData.cancelledBookings],
      ['Average Ticket Price', `₹${reportData.averageTicketPrice.toFixed(2)}`],
      [],
      ['Top Routes'],
      ['Route', 'Bookings'],
      ...reportData.topRoutes.map(r => [r.name, r.bookings]),
      [],
      ['Top Buses'],
      ['Bus', 'Revenue'],
      ...reportData.topBuses.map(b => [b.name, `₹${b.revenue}`])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${dateRange.from}-to-${dateRange.to}.csv`;
    a.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <button 
          onClick={exportReport}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Export Report
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <button
            onClick={generateReport}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading report...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">₹{reportData.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Bookings</h3>
              <p className="text-3xl font-bold text-blue-600">{reportData.totalBookings}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Cancelled</h3>
              <p className="text-3xl font-bold text-red-600">{reportData.cancelledBookings}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Avg Ticket Price</h3>
              <p className="text-3xl font-bold text-purple-600">₹{reportData.averageTicketPrice.toFixed(0)}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Top Routes */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Top 5 Routes</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.topRoutes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Buses */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Top 5 Buses by Revenue</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.topBuses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Revenue */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Daily Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
