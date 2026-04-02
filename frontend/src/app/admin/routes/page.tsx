'use client';

import { useEffect, useState } from 'react';
import { routeService } from '../../../services/routeService';
import type { Route } from '../../../types/firestore';

export default function AdminRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    distance: '' as number | '',
    duration: '' as number | '',
    stops: [] as string[]
  });
  const [stopInput, setStopInput] = useState('');

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    const data = await routeService.getAllRoutes();
    setRoutes(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await routeService.updateRoute(editingRoute.id!, formData);
      } else {
        await routeService.createRoute(formData);
      }
      resetForm();
      loadRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Failed to save route');
    }
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      source: route.source,
      destination: route.destination,
      distance: route.distance,
      duration: route.duration,
      stops: route.stops || []
    });
    setShowForm(true);
  };

  const handleDelete = async (routeId: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      try {
        await routeService.deleteRoute(routeId);
        loadRoutes();
      } catch (error) {
        console.error('Error deleting route:', error);
        alert('Failed to delete route');
      }
    }
  };

  const addStop = () => {
    if (stopInput.trim()) {
      setFormData(prev => ({
        ...prev,
        stops: [...prev.stops, stopInput.trim()]
      }));
      setStopInput('');
    }
  };

  const removeStop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      source: '',
      destination: '',
      distance: '',
      duration: '',
      stops: []
    });
    setEditingRoute(null);
    setShowForm(false);
    setStopInput('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Routes</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create Route
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingRoute ? 'Edit Route' : 'Create New Route'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Source City</label>
                  <input
                    type="text"
                    required
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="e.g., Bangalore"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Destination City</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="e.g., Mumbai"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Distance (km)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value ? parseInt(e.target.value) : '' })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    required
                    min="0.5"
                    step="0.5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value ? parseFloat(e.target.value) : '' })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Stops (Optional)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={stopInput}
                    onChange={(e) => setStopInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStop())}
                    className="flex-1 border rounded-lg px-4 py-2"
                    placeholder="Add a stop and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addStop}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.stops.map((stop, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {stop}
                      <button
                        type="button"
                        onClick={() => removeStop(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
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
                  {editingRoute ? 'Update' : 'Create'} Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Source</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Destination</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Distance</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Duration</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Stops</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{route.source}</td>
                <td className="px-6 py-4 font-medium">{route.destination}</td>
                <td className="px-6 py-4">{route.distance} km</td>
                <td className="px-6 py-4">{route.duration} hrs</td>
                <td className="px-6 py-4">
                  {route.stops && route.stops.length > 0 ? (
                    <span className="text-sm text-gray-600">{route.stops.length} stops</span>
                  ) : (
                    <span className="text-sm text-gray-400">Direct</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleEdit(route)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(route.id!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {routes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No routes found. Create your first route to get started.
          </div>
        )}
      </div>
    </div>
  );
}
