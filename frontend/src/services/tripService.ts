import { tripService as firestoreTripService } from '../lib/firestore';
import type { Trip } from '../types/firestore';

export const tripService = {
  async createTrip(trip: Omit<Trip, 'id'>) {
    return await firestoreTripService.createTrip(trip);
  },

  async getTrip(tripId: string) {
    return await firestoreTripService.getTrip(tripId);
  },

  async searchTrips(routeId: string, date: string) {
    return await firestoreTripService.searchTrips(routeId, date);
  },

  async getAllTrips() {
    return await firestoreTripService.getAllTrips();
  },

  async updateTrip(tripId: string, trip: Partial<Trip>) {
    const { id, ...updateData } = trip as any;
    return await firestoreTripService.updateTrip(tripId, updateData);
  },

  async updateAvailableSeats(tripId: string, availableSeats: number) {
    return await firestoreTripService.updateAvailableSeats(tripId, availableSeats);
  },

  async deleteTrip(tripId: string) {
    return await firestoreTripService.deleteTrip(tripId);
  }
};

export type { Trip };

