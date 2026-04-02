'use client';

import { useEffect, useState } from 'react';
import { bookingService } from '../../../services/bookingService';
import { busService } from '../../../services/busService';
import { routeService } from '../../../services/routeService';
import type { Booking, Bus, Route } from '../../../types/firestore';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [bookingsData, busesData, routesData] = await Promise.all([
      bookingService.getAllBookings(),
      busService.getAllBuses(),
      routeService.getAllRoutes()
    ]);
    setBookings(bookingsData);
    setBuses(busesData);
    setRoutes(routesData);
  };

  const getBusName = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    return bus ? bus.name : 'N/A';
  };

  const getRouteName = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route ? `${route.source} → ${route.destination}` : 'N/A';
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.pnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.passengerName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    pending: bookings.filter(b => b.status === 'pending').length
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Bookings</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Bookings</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Confirmed</h3>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Cancelled</h3>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by PNR or passenger name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">PNR</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Passenger</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Bus</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Route</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Seats</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{booking.pnr}</td>
                <td className="px-6 py-4">{booking.passengerName || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">{getBusName(booking.busId)}</td>
                <td className="px-6 py-4 text-sm">{getRouteName(booking.routeId)}</td>
                <td className="px-6 py-4">{booking.seats?.join(', ')}</td>
                <td className="px-6 py-4 font-semibold">₹{booking.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No bookings found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
