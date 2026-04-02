'use client';

import { useState } from 'react';
import { testFirebaseConnection } from '../../lib/firebase-test';
import { busService, routeService, tripService } from '../../lib/firestore';

export default function TestFirebasePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    const testResult = await testFirebaseConnection();
    setResult(testResult);
    setLoading(false);
  };

  const handleTestBuses = async () => {
    setLoading(true);
    try {
      const buses = await busService.getAllBuses();
      setResult({
        success: true,
        message: 'Buses fetched successfully',
        data: buses,
        count: buses.length
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message
      });
    }
    setLoading(false);
  };

  const handleTestRoutes = async () => {
    setLoading(true);
    try {
      const routes = await routeService.getAllRoutes();
      setResult({
        success: true,
        message: 'Routes fetched successfully',
        data: routes,
        count: routes.length
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message
      });
    }
    setLoading(false);
  };

  const handleTestTrips = async () => {
    setLoading(true);
    try {
      const trips = await tripService.getAllTrips();
      setResult({
        success: true,
        message: 'Trips fetched successfully',
        data: trips,
        count: trips.length
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Operations</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleTestConnection}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              onClick={handleTestBuses}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Fetch All Buses'}
            </button>

            <button
              onClick={handleTestRoutes}
              disabled={loading}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Fetch All Routes'}
            </button>

            <button
              onClick={handleTestTrips}
              disabled={loading}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Fetch All Trips'}
            </button>
          </div>
        </div>

        {result && (
          <div className={`rounded-lg shadow p-6 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className="text-xl font-semibold mb-4">
              {result.success ? '✅ Success' : '❌ Error'}
            </h2>
            <pre className="bg-white p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
