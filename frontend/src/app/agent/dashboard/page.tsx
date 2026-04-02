'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  Search, 
  FileText, 
  DollarSign,
  Activity,
  ArrowRight,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { firestoreService, COLLECTIONS } from '../../../lib/firestore';
import { bookingService } from '../../../services/bookingService';
import { tripService } from '../../../services/tripService';
import { busService } from '../../../services/busService';
import { routeService } from '../../../services/routeService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WalletData {
  balance: number;
  totalCommissionEarned: number;
  totalBookings: number;
}

interface Stats {
  todayBookings: number;
  todayCommission: number;
  averageBookingValue: number;
  averageCommission: number;
}

export default function AgentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletData>({ balance: 0, totalCommissionEarned: 0, totalBookings: 0 });
  const [stats, setStats] = useState<Stats>({ todayBookings: 0, todayCommission: 0, averageBookingValue: 0, averageCommission: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentTravelBuses, setRecentTravelBuses] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadDashboardData();
    }
  }, [user]);

  const loadRecentTravelBuses = async () => {
    try {
      const recentBookings = await bookingService.getRecentBookings(6);
      
      const uniqueTrips = new Map();
      for (const booking of recentBookings) {
        if (!uniqueTrips.has(booking.tripId)) {
          const trip = await tripService.getTrip(booking.tripId);
          if (trip) {
            const bus = await busService.getBus(trip.busId);
            const route = await routeService.getRoute(trip.routeId);
            uniqueTrips.set(booking.tripId, { trip, bus, route });
          }
        }
      }
      
      setRecentTravelBuses(Array.from(uniqueTrips.values()).slice(0, 3));
    } catch (error) {
      console.error('Error loading recent travel buses:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!user?.uid) {
        console.error('No user ID available');
        setLoading(false);
        return;
      }
      
      // Load wallet data
      const walletDoc = await firestoreService.read('wallets', user.uid);
      if (walletDoc && 'balance' in walletDoc && 'totalCommissionEarned' in walletDoc) {
        setWallet(walletDoc as unknown as WalletData);
      }

      // Load bookings
      const bookings = await firestoreService.queryDocs(COLLECTIONS.BOOKINGS, []);
      const agentBookings = bookings.filter((b: any) => b.agentId === user.uid);

      // Load recent travel buses
      await loadRecentTravelBuses();

      // Calculate today's stats
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = agentBookings.filter((b: any) => 
        b.bookingDate?.split('T')[0] === today
      );
      const todayCommission = todayBookings.reduce((sum: number, b: any) => sum + (b.commission || 0), 0);

      // Calculate averages
      const totalRevenue = agentBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
      const totalCommission = agentBookings.reduce((sum: number, b: any) => sum + (b.commission || 0), 0);
      const averageBookingValue = agentBookings.length > 0 ? totalRevenue / agentBookings.length : 0;
      const averageCommission = agentBookings.length > 0 ? totalCommission / agentBookings.length : 0;

      setStats({
        todayBookings: todayBookings.length,
        todayCommission,
        averageBookingValue,
        averageCommission
      });

      // Recent bookings (last 5)
      const sortedBookings = agentBookings
        .sort((a: any, b: any) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
        .slice(0, 5);
      setRecentBookings(sortedBookings);

      // Chart data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const chartData = last7Days.map(date => {
        const dayBookings = agentBookings.filter((b: any) => 
          b.bookingDate?.split('T')[0] === date
        );
        const dayCommission = dayBookings.reduce((sum: number, b: any) => sum + (b.commission || 0), 0);
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          bookings: dayBookings.length,
          commission: dayCommission
        };
      });
      setChartData(chartData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchRoute = (source: string, destination: string) => {
    navigate(`/agent/search?source=${source}&destination=${destination}&date=${new Date().toISOString().split('T')[0]}`);
  };

  const handleBookNow = (tripId: string) => {
    navigate(`/agent/seat-selection?tripId=${tripId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-neutral-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
              <p className="text-neutral-600 mt-1">Welcome back, {(user as any)?.name || 'Agent'} 👋</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
              <div className="text-sm text-neutral-600">Commission Rate</div>
              <div className="text-2xl font-bold text-primary-600">
                {((user as any)?.commissionRate || 0.05) * 100}%
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-neutral-600 text-sm font-medium mb-1">Wallet Balance</h3>
            <p className="text-3xl font-bold text-neutral-900 mb-2">₹{wallet.balance.toLocaleString()}</p>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Add Funds →
            </button>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-semibold">+{stats.todayBookings}</span>
              </div>
            </div>
            <h3 className="text-neutral-600 text-sm font-medium mb-1">Total Bookings</h3>
            <p className="text-3xl font-bold text-neutral-900 mb-2">{wallet.totalBookings}</p>
            <p className="text-sm text-neutral-500">Today: {stats.todayBookings} bookings</p>
          </div>

          {/* Total Commission */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-semibold">+12%</span>
              </div>
            </div>
            <h3 className="text-neutral-600 text-sm font-medium mb-1">Total Commission</h3>
            <p className="text-3xl font-bold text-neutral-900 mb-2">₹{wallet.totalCommissionEarned.toLocaleString()}</p>
            <p className="text-sm text-neutral-500">Today: ₹{stats.todayCommission.toFixed(0)}</p>
          </div>

          {/* Avg Commission */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                Per Booking
              </span>
            </div>
            <h3 className="text-neutral-600 text-sm font-medium mb-1">Avg Commission</h3>
            <p className="text-3xl font-bold text-neutral-900 mb-2">₹{stats.averageCommission.toFixed(0)}</p>
            <p className="text-sm text-neutral-500">Avg booking: ₹{stats.averageBookingValue.toFixed(0)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/agent/search" 
            className="group bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Search Buses</h3>
            <p className="text-sm text-neutral-600">Find and book buses for customers</p>
          </Link>

          <Link 
            to="/agent/bookings" 
            className="group bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-lg hover:border-green-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">My Bookings</h3>
            <p className="text-sm text-neutral-600">View all your bookings</p>
          </Link>

          <Link 
            to="/agent/wallet" 
            className="group bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Wallet</h3>
            <p className="text-sm text-neutral-600">View transaction history</p>
          </Link>
        </div>

        {/* Recent Travel Buses */}
        {recentTravelBuses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Recent Travel Buses</h2>
                <p className="text-sm text-neutral-500 mt-1">Popular routes from recent bookings</p>
              </div>
              <Link 
                to="/agent/search" 
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentTravelBuses.map(({ trip, bus, route }) => (
                <div
                  key={trip.id}
                  className="border border-neutral-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-neutral-900 mb-1">{bus?.name}</h3>
                      <p className="text-sm text-neutral-600">{bus?.operator}</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {bus?.type}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <MapPin className="w-4 h-4 text-primary-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{route.source} → {route.destination}</p>
                        <p className="text-xs text-neutral-500">{route.distance}km • {route.duration}hrs</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Clock className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{trip.departureTime}</span>
                          <span className="text-neutral-400 mx-2">→</span>
                          <span className="font-medium">{trip.arrivalTime}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div>
                      <p className="text-xs text-neutral-500">Starting from</p>
                      <p className="text-lg font-bold text-primary-600">₹{trip.basePrice}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSearchRoute(route.source, route.destination)}
                        className="px-3 py-2 text-sm border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                      >
                        Search
                      </button>
                      <button
                        onClick={() => handleBookNow(trip.id)}
                        className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Bookings Trend</h2>
                <p className="text-sm text-neutral-500 mt-1">Last 7 days performance</p>
              </div>
              <Calendar className="w-5 h-5 text-neutral-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
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
                <Bar 
                  dataKey="bookings" 
                  fill="#3b82f6" 
                  name="Bookings" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Commission Trend</h2>
                <p className="text-sm text-neutral-500 mt-1">Daily earnings overview</p>
              </div>
              <DollarSign className="w-5 h-5 text-neutral-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                <Line 
                  type="monotone" 
                  dataKey="commission" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#colorCommission)"
                  name="Commission (₹)" 
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Recent Bookings</h2>
              <p className="text-sm text-neutral-500 mt-1">Your latest transactions</p>
            </div>
            <Link 
              to="/agent/bookings" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">PNR</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Seats</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Commission</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-4 font-mono text-sm text-neutral-900">{booking.pnr}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{booking.seats?.join(', ')}</td>
                      <td className="px-4 py-4 font-semibold text-neutral-900">₹{booking.totalAmount}</td>
                      <td className="px-4 py-4 font-semibold text-green-600">₹{booking.commission || 0}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                <FileText className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-600 font-medium mb-2">No bookings yet</p>
              <p className="text-sm text-neutral-500 mb-4">Start by searching for buses!</p>
              <Link 
                to="/agent/search"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Search className="w-4 h-4" />
                Search Buses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
