import { routeService as firestoreRouteService } from '../lib/firestore';
import type { Route } from '../types/firestore';

export const routeService = {
  async createRoute(routeData: Omit<Route, 'id'>) {
    return await firestoreRouteService.createRoute(routeData);
  },

  async getRoute(routeId: string) {
    return await firestoreRouteService.getRoute(routeId);
  },

  async getAllRoutes() {
    return await firestoreRouteService.getAllRoutes();
  },

  async searchRoutes(source: string, destination: string) {
    return await firestoreRouteService.searchRoutes(source, destination);
  },

  async updateRoute(routeId: string, data: Partial<Route>) {
    const { id, ...updateData } = data as any;
    return await firestoreRouteService.updateRoute(routeId, updateData);
  },

  async deleteRoute(routeId: string) {
    return await firestoreRouteService.deleteRoute(routeId);
  }
};

export type { Route };
