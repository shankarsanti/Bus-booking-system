'use client';

import { useEffect, useState } from 'react';
import { busService } from '../../../services/busService';
import type { Bus } from '../../../types/firestore';

export default function AdminBuses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    type: 'AC Sleeper',
    totalSeats: 40 as number | '',
    amenities: [] as string[],
    operator: ''
  });

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    const data = await busService.getAllBuses();
    setBuses(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await busService.updateBus(editingBus.id!, formData);
      } else {
        await busService.createBus(formData);
      }
      resetForm();
      loadBuses();
    } catch (error) {
      console.error('Error saving bus:', error);
      alert('Failed to save bus');
    }
  };

  const handleEdit = (bus: Bus) => {
    setEditingBus(bus);
    setFormData({
      name: bus.name,
      number: bus.number,
      type: bus.type,
      totalSeats: bus.totalSeats,
      amenities: bus.amenities || [],
      operator: bus.operator || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (busId: string) => {
    if (confirm('Are you sure you want to delete this bus?')) {
      try {
        await busService.deleteBus(busId);
        loadBuses();
      } catch (error) {
        console.error('Error deleting bus:', error);
        alert('Failed to delete bus');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      type: 'AC Sleeper',
      totalSeats: 40,
      amenities: [],
      operator: ''
    });
    setEditingBus(null);
    setShowForm(false);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const amenitiesList = ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Reading Light', 'Emergency Exit'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Buses</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Bus
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingBus ? 'Edit Bus' : 'Add New Bus'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bus Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="e.g., Volvo Multi-Axle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bus Number</label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="e.g., KA-01-AB-1234"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bus Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option>AC Sleeper</option>
                    <option>Non-AC Sleeper</option>
                    <option>AC Seater</option>
                    <option>Non-AC Seater</option>
                    <option>Volvo AC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Seats</label>
                  <input
                    type="number"
                    required
                    min="20"
                    max="60"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value ? parseInt(e.target.value) : '' })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Operator</label>
                <input
                  type="text"
                  required
                  value={formData.operator}
                  onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="e.g., RedBus Travels"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4"
                      />
                      <span>{amenity}</span>
                    </label>
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
                  {editingBus ? 'Update' : 'Add'} Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Bus Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Number</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Operator</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Seats</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Amenities</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{bus.name}</td>
                <td className="px-6 py-4 font-mono text-sm">{bus.number}</td>
                <td className="px-6 py-4">{bus.type}</td>
                <td className="px-6 py-4">{bus.operator}</td>
                <td className="px-6 py-4">{bus.totalSeats}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {bus.amenities?.slice(0, 2).map(a => (
                      <span key={a} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {a}
                      </span>
                    ))}
                    {bus.amenities && bus.amenities.length > 2 && (
                      <span className="text-xs text-gray-500">+{bus.amenities.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleEdit(bus)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(bus.id!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {buses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No buses found. Add your first bus to get started.
          </div>
        )}
      </div>
    </div>
  );
}
