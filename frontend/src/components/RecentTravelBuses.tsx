'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, Clock, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { tripService, routeService, busService } from '../lib/firestore';
import { Card, CardHeader, CardTitle, CardContent, Badge, LoadingSpinner } from './ui';

interface TripWithDetails {
  id: string;
  busName: string;
  busNumber: string;
  busType: string;
  source: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  availableSeats: number;
  distance: number;
  duration: number;
}

interface RecentTravelBusesProps {
  limit?: number;
  userRole?: 'admin' | 'agent' | 'customer';
}

export default function RecentTravelBuses({ limit = 6, userRole = 'customer' }: RecentTravelBusesProps) {
  const [trips, setTrips] = useState<TripWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentTrips();
  }, []);

  const loadRecentTrips = async () => {
    try {
      setLoading(true);
      
      // Get upcoming trips (today and future)
      const today = new Date().toISOString().split('T')[0];
      const allTrips = await tripService.getAllTrips();
      
      // Filter for upcoming trips only
      const upcomingTrips = allTrips.filter((trip: any) => trip.date >= today);
      
      // Sort by date and time
      const sortedTrips = upcomingTrips.sort((a: any, b: any) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.departureTime.localeCompare(b.departureTime);
      });

      // Get details for each trip
      const tripsWithDetails = await Promise.all(
        sortedTrips.slice(0, limit).map(async (trip: any) => {
          const [bus, route] = await Promise.all([
            busService.getBus(trip.busId),
            routeService.getRoute(trip.routeId)
          ]);

          return {
            id: trip.id,
            busName: bus?.name || 'Unknown Bus',
            busNumber: bus?.number || 'N/A',
            busType: bus?.type || 'Standard',
            source: route?.source || 'Unknown',
            destination: route?.destination || 'Unknown',
            date: trip.date,
            departureTime: trip.departureTime,
            arrivalTime: trip.arrivalTime,
            basePrice: trip.basePrice,
            availableSeats: trip.availableSeats,
            distance: route?.distance || 0,
            duration: route?.duration || 0
          };
        })
      );

      setTrips(tripsWithDetails);
    } catch (error) {
      console.error('Error loading recent trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingLink = (tripId: string) => {
    switch (userRole) {
      case 'admin':
        return `/admin/trips`;
      case 'agent':
        return `/agent/seat-selection?tripId=${tripId}`;
      case 'customer':
      default:
        return `/customer/seat-selection?tripId=${tripId}`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Travel Buses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (trips.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Travel Buses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
              <Bus className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-600 font-medium mb-2">No upcoming trips available</p>
            <p className="text-sm text-neutral-500">Check back later for new routes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Recent Travel Buses
            </CardTitle>
            <p className="text-sm text-neutral-600 mt-1">Available routes for upcoming travel</p>
          </div>
          {userRole === 'admin' && (
            <Link 
              to="/admin/trips"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip, index) => (
            <div 
              key={trip.id}
              className="group border border-neutral-200 rounded-xl p-4 hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Route Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <span className="font-bold text-neutral-900">{trip.source}</span>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                    <span className="font-bold text-neutral-900">{trip.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Bus className="w-3.5 h-3.5" />
                    <span className="font-medium">{trip.busName}</span>
                    <span className="text-neutral-400">•</span>
                    <span>{trip.busNumber}</span>
                  </div>
                </div>
                <Badge variant={trip.availableSeats > 10 ? 'success' : 'warning'} size="sm">
                  {trip.availableSeats} seats
                </Badge>
              </div>

              {/* Trip Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(trip.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{trip.departureTime} - {trip.arrivalTime}</span>
                  <span className="text-neutral-400">•</span>
                  <span>{Math.floor(trip.duration / 60)}h {trip.duration % 60}m</span>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div>
                  <p className="text-xs text-neutral-500">Starting from</p>
                  <p className="text-xl font-bold text-primary-600">₹{trip.basePrice}</p>
                </div>
                {userRole !== 'admin' ? (
                  <Link
                    to={getBookingLink(trip.id)}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium group-hover:scale-105 transform"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to={`/admin/trips`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
