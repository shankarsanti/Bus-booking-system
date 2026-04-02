'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { routeService } from '../../../services/routeService';
import { tripService } from '../../../services/tripService';
import { busService } from '../../../services/busService';
import { bookingService } from '../../../services/bookingService';
import { MapPin, Clock } from 'lucide-react';

export default function AgentSearch() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const [searchParams, setSearchParams] = useState({
    source: urlParams.get('source') || '',
    destination: urlParams.get('destination') || '',
    date: urlParams.get('date') || new Date().toISOString().split('T')[0]
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentBuses, setRecentBuses] = useState<any[]>([]);

  useEffect(() => {
    loadRecentBuses();
    // Auto-search if URL params are present
    if (urlParams.get('source') && urlParams.get('destination')) {
      handleSearch(null);
    }
  }, []);

  const loadRecentBuses = async () => {
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
      
      setRecentBuses(Array.from(uniqueTrips.values()));
    } catch (error) {
      console.error('Error loading recent buses:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      // Find routes matching source and destination
      const routes = await routeService.searchRoutes(searchParams.source, searchParams.destination);
      
      if (routes.length === 0) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      // Find trips for each route on the selected date
      const allTrips = [];
      for (const route of routes) {
        const trips = await tripService.searchTrips(route.id!, searchParams.date);
        
        // Get bus details for each trip
        for (const trip of trips) {
          const bus = await busService.getBus(trip.busId);
          allTrips.push({
            ...trip,
            route,
            bus
          });
        }
      }

      setSearchResults(allTrips);
    } catch (error) {
      console.error('Error searching buses:', error);
      alert('Failed to search buses');
    } finally {
      setLoading(false);
    }
  };

  const handleBookForCustomer = (tripId: string) => {
    navigate(`/agent/seat-selection?tripId=${tripId}`);
  };

  const handleQuickBook = (tripId: string, route: any) => {
    navigate(`/agent/seat-selection?tripId=${tripId}`);
  };

  const handleSearchFromRecent = (source: string, destination: string) => {
    setSearchParams({
      source,
      destination,
      date: new Date().toISOString().split('T')[0]
    });
    // Trigger search automatically
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Buses for Customer</h1>

        {/* Recent Travel Buses */}
        {recentBuses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Travel Buses
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBuses.map(({ trip, bus, route }) => (
                <div
                  key={trip.id}
                  className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{bus?.name}</h3>
                      <p className="text-sm text-gray-600">{bus?.operator}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {bus?.type}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{route.source} → {route.destination}</p>
                        <p className="text-xs text-gray-500">{route.distance}km • {route.duration}hrs</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-green-600" />
                      <p className="text-sm">
                        {trip.departureTime} → {trip.arrivalTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Base Price</p>
                      <p className="text-lg font-bold text-blue-600">₹{trip.basePrice}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSearchFromRecent(route.source, route.destination)}
                        className="px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                      >
                        Search
                      </button>
                      <button
                        onClick={() => handleQuickBook(trip.id, route)}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <input
                  type="text"
                  required
                  value={searchParams.source}
                  onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Source city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <input
                  type="text"
                  required
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Destination city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Searching...' : 'Search Buses'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Searching for available buses...</div>
          </div>
        ) : searched && searchResults.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🚌</div>
            <h2 className="text-2xl font-bold mb-2">No buses found</h2>
            <p className="text-gray-600">Try searching for a different route or date</p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div key={result.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{result.bus?.name || 'Bus'}</h3>
                        <p className="text-sm text-gray-600">{result.bus?.type} • {result.bus?.operator}</p>
                      </div>
                      {result.bus?.amenities && result.bus.amenities.length > 0 && (
                        <div className="flex gap-2">
                          {result.bus.amenities.slice(0, 3).map((amenity: string) => (
                            <span key={amenity} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="font-semibold">{result.route?.source} → {result.route?.destination}</p>
                        <p className="text-xs text-gray-500">{result.route?.distance}km • {result.route?.duration}hrs</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Departure</p>
                        <p className="font-semibold">{result.departureTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Arrival</p>
                        <p className="font-semibold">{result.arrivalTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Available Seats</p>
                        <p className={`text-lg font-bold ${
                          result.availableSeats > 10 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {result.availableSeats} seats
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Base Price</p>
                        <p className="text-lg font-bold text-blue-600">₹{result.basePrice}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => handleBookForCustomer(result.id)}
                      disabled={result.availableSeats === 0}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {result.availableSeats === 0 ? 'Sold Out' : 'Book for Customer'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
