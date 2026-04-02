'use client';

import { useEffect, useState } from 'react';
import { firestoreService, COLLECTIONS } from '../../../lib/firestore';
import { Wallet, Plus, TrendingUp, Users } from 'lucide-react';

interface AgentWallet {
  id: string;
  agentId: string;
  agentName?: string;
  agentEmail?: string;
  balance: number;
  totalCommissionEarned: number;
  totalBookings: number;
}

export default function AdminWallets() {
  const [wallets, setWallets] = useState<AgentWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<AgentWallet | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setLoading(true);
      
      // Load all users with agent role
      const allUsers = await firestoreService.getAll(COLLECTIONS.USERS);
      const agentUsers = allUsers.filter((u: any) => u.role === 'agent');
      
      console.log('Found agents:', agentUsers.length);
      
      // Remove duplicates based on agent ID
      const uniqueAgents = Array.from(
        new Map(agentUsers.map((agent: any) => [agent.id, agent])).values()
      );
      
      console.log('Unique agents:', uniqueAgents.length);
      
      // Load wallets for each agent
      const walletsData: AgentWallet[] = [];
      
      for (const agent of uniqueAgents) {
        try {
          // Try to get wallet for this agent
          const walletData = await firestoreService.read('wallets', agent.id);
          
          if (walletData) {
            // Wallet exists
            walletsData.push({
              id: walletData.id,
              agentId: agent.id,
              agentName: (agent as any).name || 'Unknown Agent',
              agentEmail: (agent as any).email || 'N/A',
              balance: (walletData as any).balance || 0,
              totalCommissionEarned: (walletData as any).totalCommissionEarned || 0,
              totalBookings: (walletData as any).totalBookings || 0
            });
          } else {
            // Wallet doesn't exist, create it
            console.log('Creating wallet for agent:', agent.id);
            await firestoreService.createWithId('wallets', agent.id, {
              agentId: agent.id,
              balance: 0,
              totalCommissionEarned: 0,
              totalBookings: 0
            });
            
            walletsData.push({
              id: agent.id,
              agentId: agent.id,
              agentName: (agent as any).name || 'Unknown Agent',
              agentEmail: (agent as any).email || 'N/A',
              balance: 0,
              totalCommissionEarned: 0,
              totalBookings: 0
            });
          }
        } catch (error) {
          console.error('Error loading wallet for agent:', agent.id, error);
        }
      }
      
      console.log('Loaded wallets:', walletsData.length);
      
      // Remove any duplicates based on agentId (just in case)
      const uniqueWallets = Array.from(
        new Map(walletsData.map(wallet => [wallet.agentId, wallet])).values()
      );
      
      console.log('Unique wallets:', uniqueWallets.length);
      setWallets(uniqueWallets);
    } catch (error) {
      console.error('Error loading wallets:', error);
      alert('Failed to load wallets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = (wallet: AgentWallet) => {
    setSelectedWallet(wallet);
    setAmount('');
    setDescription('Admin credit - Wallet top-up');
    setShowAddFundsModal(true);
  };

  const handleSubmitFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWallet || !amount) return;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    setProcessing(true);
    
    try {
      const now = new Date().toISOString();
      const newBalance = selectedWallet.balance + amountNum;
      
      // Create credit transaction
      await firestoreService.create('walletTransactions', {
        agentId: selectedWallet.agentId,
        type: 'credit',
        amount: amountNum,
        balanceBefore: selectedWallet.balance,
        balanceAfter: newBalance,
        description: description || 'Admin credit - Wallet top-up',
        createdAt: now,
        createdBy: 'admin'
      });
      
      // Update wallet balance (use agentId as document ID)
      await firestoreService.update('wallets', selectedWallet.agentId, {
        balance: newBalance
      });
      
      alert(`Successfully added ₹${amountNum} to ${selectedWallet.agentName}'s wallet`);
      setShowAddFundsModal(false);
      loadWallets();
    } catch (error) {
      console.error('Error adding funds:', error);
      alert('Failed to add funds. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const stats = {
    totalAgents: wallets.length,
    totalBalance: wallets.reduce((sum, w) => sum + w.balance, 0),
    totalCommission: wallets.reduce((sum, w) => sum + w.totalCommissionEarned, 0),
    totalBookings: wallets.reduce((sum, w) => sum + w.totalBookings, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading wallets...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Wallets</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h3 className="text-gray-500 text-sm">Total Agents</h3>
          </div>
          <p className="text-3xl font-bold">{stats.totalAgents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-8 h-8 text-green-600" />
            <h3 className="text-gray-500 text-sm">Total Balance</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">₹{stats.totalBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h3 className="text-gray-500 text-sm">Total Commission</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">₹{stats.totalCommission.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <h3 className="text-gray-500 text-sm">Total Bookings</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.totalBookings}</p>
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Agent Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Balance</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Commission Earned</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Bookings</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{wallet.agentName}</td>
                <td className="px-6 py-4 text-gray-600">{wallet.agentEmail}</td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-green-600">
                    ₹{wallet.balance.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-purple-600 font-semibold">
                  ₹{wallet.totalCommissionEarned.toLocaleString()}
                </td>
                <td className="px-6 py-4 font-semibold">{wallet.totalBookings}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleAddFunds(wallet)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Funds
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {wallets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl">No agent wallets found</p>
            <p className="text-sm mt-2">Wallets will be created automatically when agents are added</p>
          </div>
        )}
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && selectedWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add Funds to Wallet</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Agent</p>
              <p className="font-bold text-lg">{selectedWallet.agentName}</p>
              <p className="text-sm text-gray-600 mt-2">Current Balance</p>
              <p className="text-2xl font-bold text-green-600">₹{selectedWallet.balance.toLocaleString()}</p>
            </div>

            <form onSubmit={handleSubmitFunds}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount to Add (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 text-lg"
                  placeholder="Enter amount"
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="e.g., Wallet top-up"
                />
              </div>

              {amount && parseFloat(amount) > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">New Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{(selectedWallet.balance + parseFloat(amount)).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddFundsModal(false)}
                  disabled={processing}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing || !amount || parseFloat(amount) <= 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Add Funds'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
