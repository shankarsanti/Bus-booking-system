import { busService as firestoreBusService } from '../lib/firestore';
import type { Bus } from '../types/firestore';

export const busService = {
  async createBus(bus: Omit<Bus, 'id'>) {
    return await firestoreBusService.createBus(bus);
  },

  async getBus(busId: string) {
    return await firestoreBusService.getBus(busId);
  },

  async getAllBuses() {
    return await firestoreBusService.getAllBuses();
  },

  async updateBus(busId: string, bus: Partial<Bus>) {
    const { id, ...updateData } = bus as any;
    return await firestoreBusService.updateBus(busId, updateData);
  },

  async deleteBus(busId: string) {
    return await firestoreBusService.deleteBus(busId);
  }
};

export type { Bus };

