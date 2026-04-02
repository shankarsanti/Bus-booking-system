'use client';

import { useEffect, useState } from 'react';
import { tripService } from '../../../services/tripService';
import { busService } from '../../../services/busService';
import { routeService } from '../../../services/routeService';
import type { Trip, Bus, Route } from '../../../types/firestore';

export default function AdminTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    basePrice: 500 as number | '',
    availableSeats: 40 as number | ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [tripsData, busesData, routesData] = await Promise.all([
      tripService.getAllTrips(),
      busService.getAllBuses(),
      routeService.getAllRoutes()
    ]);
    setTrips(tripsData);
    setBuses(busesData);
    setRoutes(routesData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTrip) {
        await tripService.updateTrip(editingTrip.id!, formData);
      } else {
        await tripService.createTrip(formData);
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip');
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      busId: trip.busId,
      routeId: trip.routeId,
      date: trip.date,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      basePrice: trip.basePrice,
      availableSeats: trip.availableSeats
    });
    setShowForm(true);
  };

  const handleDelete = async (tripId: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripService.deleteTrip(tripId);
        loadData();
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      busId: '',
      routeId: '',
      date: '',
      departureTime: '',
      arrivalTime: '',
      basePrice: 500,
      availableSeats: 40
    });
    setEditingTrip(null);
    setShowForm(false);
  };

  const getBusName = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    return bus ? `${bus.name} (${bus.number})` : busId;
  };

  const getRouteName = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route ? `${route.source} → ${route.destination}` : routeId;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Schedule Trips</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Schedule Trip
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingTrip ? 'Edit Trip' : 'Schedule New Trip'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Bus</label>
                <select
                  required
                  value={formData.busId}
                  onChange={(e) => {
                    const bus = buses.find(b => b.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      busId: e.target.value,
                      availableSeats: bus?.totalSeats || 40
                    });
                  }}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Choose a bus</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.name} - {bus.number} ({bus.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Route</label>
                <select
                  required
                  value={formData.routeId}
                  onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Choose a route</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.source} → {route.destination} ({route.distance}km, {route.duration}hrs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Departure Time</label>
                  <input
                    type="time"
                    required
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Arrival Time</label>
                  <input
                    type="time"
                    required
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value ? parseInt(e.target.value) : '' })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Available Seats</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.availableSeats}
                    onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value ? parseInt(e.target.value) : '' })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTrip ? 'Update' : 'Schedule'} Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trips Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Bus</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Route</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Departure</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Arrival</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Seats</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{getBusName(trip.busId)}</td>
                <td className="px-6 py-4 text-sm font-medium">{getRouteName(trip.routeId)}</td>
                <td className="px-6 py-4">{new Date(trip.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{trip.departureTime}</td>
                <td className="px-6 py-4">{trip.arrivalTime}</td>
                <td className="px-6 py-4">₹{trip.basePrice}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    trip.availableSeats > 10 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {trip.availableSeats}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleEdit(trip)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(trip.id!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {trips.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No trips scheduled. Schedule your first trip to get started.
          </div>
        )}
      </div>
    </div>
  );
}
