'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Bus, Users, Wallet, Calendar, Activity, UserCheck } from 'lucide-react';
import { bookingService } from '../../../services/bookingService';
import { busService } from '../../../services/busService';
import { firestoreService, COLLECTIONS } from '../../../lib/firestore';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Badge, LoadingSpinner, PageTransition } from '../../../components/ui';

interface Stats {
  totalBookings: number;
  totalBuses: number;
  revenue: number;
  activeTrips: number;
  totalAgents: number;
  totalCustomers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    totalBuses: 0,
    revenue: 0,
    activeTrips: 0,
    totalAgents: 0,
    totalCustomers: 0
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingStatusData, setBookingStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [bookings, buses, users, trips] = await Promise.all([
        bookingService.getAllBookings(),
        busService.getAllBuses(),
        firestoreService.getAll(COLLECTIONS.USERS),
        firestoreService.getAll(COLLECTIONS.TRIPS)
      ]);

      const revenue = bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
      const agents = users.filter((u: any) => u.role === 'agent').length;
      const customers = users.filter((u: any) => u.role === 'customer').length;
      const activeTrips = trips.filter((t: any) => new Date(t.date) >= new Date()).length;

      setStats({
        totalBookings: bookings.length,
        totalBuses: buses.length,
        revenue,
        activeTrips,
        totalAgents: agents,
        totalCustomers: customers
      });

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const revenueByDay = last7Days.map(date => {
        const dayBookings = bookings.filter((b: any) => 
          b.bookingDate?.split('T')[0] === date
        );
        const dayRevenue = dayBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayRevenue,
          bookings: dayBookings.length
        };
      });
      setRevenueData(revenueByDay);

      const statusCounts = bookings.reduce((acc: any, b: any) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      }, {});

      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count
      }));
      setBookingStatusData(statusData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-neutral-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12.5%',
      isPositive: true
    },
    {
      title: 'Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: Wallet,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+8.2%',
      isPositive: true
    },
    {
      title: 'Total Buses',
      value: stats.totalBuses,
      icon: Bus,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+3',
      isPositive: true
    },
    {
      title: 'Active Trips',
      value: stats.activeTrips,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+15',
      isPositive: true
    },
    {
      title: 'Agents',
      value: stats.totalAgents,
      icon: UserCheck,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      change: '+5',
      isPositive: true
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      change: '+23.1%',
      isPositive: true
    }
  ];

  return (
    <PageTransition>
      <div className="p-4 md:p-6 lg:p-8 min-h-screen">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-neutral-600">
            Welcome back! Here's what's happening with SHANKAR'S BUS TRAVEL platform.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card 
              key={stat.title} 
              hover 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge 
                    variant={stat.isPositive ? 'success' : 'danger'}
                    size="sm"
                    icon={stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-neutral-600 mb-1">
                  {stat.title}
                </h3>
                <p className={`text-2xl md:text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">Last 7 days performance</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    name="Revenue (₹)" 
                    dot={{ fill: '#22c55e', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bookings Chart */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <CardHeader>
              <CardTitle>Bookings Trend</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">Daily booking volume</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="bookings" 
                    fill="#3b82f6" 
                    name="Bookings" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Booking Status Distribution */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">Current booking status breakdown</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {bookingStatusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-neutral-600">
                    {entry.name}: <span className="font-semibold">{entry.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
