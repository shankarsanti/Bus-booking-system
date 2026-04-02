'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { firestoreService } from '../../../lib/firestore';

export default function AgentWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = async () => {
    try {
      if (!user?.uid) {
        console.error('No user ID available');
        return;
      }
      
      // Load wallet
      const walletData = await firestoreService.read('wallets', user.uid);
      setWallet(walletData);

      // Load transactions
      const allTransactions = await firestoreService.getAll('walletTransactions');
      const agentTransactions = allTransactions
        .filter((t: any) => t.agentId === user.uid)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setTransactions(agentTransactions);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 mb-2">Available Balance</p>
              <p className="text-5xl font-bold mb-4">₹{wallet?.balance?.toLocaleString() || 0}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-blue-100">Total Commission Earned</p>
                  <p className="text-xl font-semibold">₹{wallet?.totalCommissionEarned?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-blue-100">Total Bookings</p>
                  <p className="text-xl font-semibold">{wallet?.totalBookings || 0}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => alert('Wallet top-up feature coming soon. Please contact admin to add funds.')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              + Add Funds
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Transaction History</h2>
          </div>

          {transactions.length > 0 ? (
            <div className="divide-y">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-2xl ${
                          transaction.type === 'credit' ? '💰' : '💸'
                        }`}>
                          {transaction.type === 'credit' ? '💰' : '💸'}
                        </span>
                        <div>
                          <p className="font-semibold">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-11 text-sm text-gray-600">
                        Balance: ₹{transaction.balanceBefore} → ₹{transaction.balanceAfter}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        transaction.type === 'credit'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <div className="text-6xl mb-4">💳</div>
              <p className="text-xl">No transactions yet</p>
              <p className="text-sm mt-2">Your wallet transactions will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
