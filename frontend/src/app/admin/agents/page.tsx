'use client';

import { useEffect, useState } from 'react';
import { firestoreService, COLLECTIONS } from '../../../lib/firestore';

interface Agent {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: 'active' | 'inactive';
  commission: number;
  createdAt?: any;
}

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    commission: 5,
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    const users = await firestoreService.getAll(COLLECTIONS.USERS);
    const agentUsers = users.filter((u: any) => u.role === 'agent');
    setAgents(agentUsers as Agent[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const agentData = {
        ...formData,
        role: 'agent'
      };

      if (editingAgent) {
        await firestoreService.update(COLLECTIONS.USERS, editingAgent.id!, agentData);
      } else {
        // Create new agent
        const agentRef = await firestoreService.create(COLLECTIONS.USERS, agentData);
        
        // Create wallet for the new agent with agent ID as document ID
        await firestoreService.createWithId('wallets', agentRef.id, {
          agentId: agentRef.id,
          balance: 0,
          totalCommissionEarned: 0,
          totalBookings: 0
        });
        
        console.log('Agent and wallet created successfully for ID:', agentRef.id);
      }
      resetForm();
      loadAgents();
      alert(editingAgent ? 'Agent updated successfully' : 'Agent created successfully with wallet');
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Failed to save agent');
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      commission: agent.commission,
      status: agent.status
    });
    setShowForm(true);
  };

  const handleDelete = async (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      try {
        await firestoreService.delete(COLLECTIONS.USERS, agentId);
        loadAgents();
      } catch (error) {
        console.error('Error deleting agent:', error);
        alert('Failed to delete agent');
      }
    }
  };

  const toggleStatus = async (agent: Agent) => {
    try {
      const newStatus = agent.status === 'active' ? 'inactive' : 'active';
      await firestoreService.update(COLLECTIONS.USERS, agent.id!, { status: newStatus });
      loadAgents();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      commission: 5,
      status: 'active'
    });
    setEditingAgent(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Agents</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Agent
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingAgent ? 'Edit Agent' : 'Add New Agent'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Commission (%)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="0.5"
                    value={formData.commission}
                    onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  {editingAgent ? 'Update' : 'Add'} Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Mobile</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Commission</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{agent.name}</td>
                <td className="px-6 py-4">{agent.email}</td>
                <td className="px-6 py-4">{agent.mobile}</td>
                <td className="px-6 py-4">{agent.commission}%</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(agent)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      agent.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {agent.status}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleEdit(agent)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(agent.id!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {agents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No agents found. Add your first agent to get started.
          </div>
        )}
      </div>
    </div>
  );
}
