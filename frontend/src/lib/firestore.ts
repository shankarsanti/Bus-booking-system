import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Bus, Route, Trip, Booking } from '../types/firestore';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  BUSES: 'buses',
  ROUTES: 'routes',
  TRIPS: 'trips',
  BOOKINGS: 'bookings',
  LOGIN_HISTORY: 'loginHistory'
} as const;

// Generic CRUD operations
export const firestoreService = {
  async create(collectionName: string, data: any) {
    return await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now()
    });
  },

  async createWithId(collectionName: string, docId: string, data: any) {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now()
    });
    return docRef;
  },

  async read(collectionName: string, docId: string) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async update(collectionName: string, docId: string, data: any) {
    const docRef = doc(db, collectionName, docId);
    return await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  async delete(collectionName: string, docId: string) {
    const docRef = doc(db, collectionName, docId);
    return await deleteDoc(docRef);
  },

  async getAll(collectionName: string) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async queryDocs(collectionName: string, conditions: any[]) {
    const q = query(collection(db, collectionName), ...conditions);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// User operations
export const userService = {
  async createUser(userId: string, userData: Omit<User, 'userId' | 'createdAt'>) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
      userId,
      ...userData,
      createdAt: Timestamp.now()
    });
    return userId;
  },

  async getUser(userId: string) {
    return await firestoreService.read(COLLECTIONS.USERS, userId) as User | null;
  },

  async updateUser(userId: string, data: Partial<User>) {
    return await firestoreService.update(COLLECTIONS.USERS, userId, data);
  },

  async getUserByMobile(mobile: string) {
    const users = await firestoreService.queryDocs(COLLECTIONS.USERS, [
      where('mobile', '==', mobile)
    ]);
    return users[0] as User | undefined;
  }
};

// Bus operations
export const busService = {
  async createBus(busData: Omit<Bus, 'busId'>) {
    const docRef = await firestoreService.create(COLLECTIONS.BUSES, busData);
    return docRef.id;
  },

  async getBus(busId: string) {
    return await firestoreService.read(COLLECTIONS.BUSES, busId) as Bus | null;
  },

  async getAllBuses() {
    return await firestoreService.getAll(COLLECTIONS.BUSES) as Bus[];
  },

  async updateBus(busId: string, data: Partial<Bus>) {
    return await firestoreService.update(COLLECTIONS.BUSES, busId, data);
  },

  async deleteBus(busId: string) {
    return await firestoreService.delete(COLLECTIONS.BUSES, busId);
  }
};

// Route operations
export const routeService = {
  async createRoute(routeData: Omit<Route, 'routeId'>) {
    const docRef = await firestoreService.create(COLLECTIONS.ROUTES, routeData);
    return docRef.id;
  },

  async getRoute(routeId: string) {
    return await firestoreService.read(COLLECTIONS.ROUTES, routeId) as Route | null;
  },

  async searchRoutes(source: string, destination: string) {
    return await firestoreService.queryDocs(COLLECTIONS.ROUTES, [
      where('source', '==', source),
      where('destination', '==', destination)
    ]) as Route[];
  },

  async getAllRoutes() {
    return await firestoreService.getAll(COLLECTIONS.ROUTES) as Route[];
  },

  async updateRoute(routeId: string, data: Partial<Route>) {
    return await firestoreService.update(COLLECTIONS.ROUTES, routeId, data);
  },

  async deleteRoute(routeId: string) {
    return await firestoreService.delete(COLLECTIONS.ROUTES, routeId);
  }
};

// Trip operations
export const tripService = {
  async createTrip(tripData: Omit<Trip, 'tripId'>) {
    const docRef = await firestoreService.create(COLLECTIONS.TRIPS, tripData);
    return docRef.id;
  },

  async getTrip(tripId: string) {
    return await firestoreService.read(COLLECTIONS.TRIPS, tripId) as Trip | null;
  },

  async searchTrips(routeId: string, date: string) {
    return await firestoreService.queryDocs(COLLECTIONS.TRIPS, [
      where('routeId', '==', routeId),
      where('date', '==', date),
      orderBy('departureTime')
    ]) as Trip[];
  },

  async getAllTrips() {
    return await firestoreService.getAll(COLLECTIONS.TRIPS) as Trip[];
  },

  async updateAvailableSeats(tripId: string, availableSeats: number) {
    return await firestoreService.update(COLLECTIONS.TRIPS, tripId, { availableSeats });
  },

  async updateTrip(tripId: string, data: Partial<Trip>) {
    return await firestoreService.update(COLLECTIONS.TRIPS, tripId, data);
  },

  async deleteTrip(tripId: string) {
    return await firestoreService.delete(COLLECTIONS.TRIPS, tripId);
  }
};

// Booking operations
export const bookingService = {
  async createBooking(bookingData: Omit<Booking, 'bookingId' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), {
      ...bookingData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getBooking(bookingId: string) {
    return await firestoreService.read(COLLECTIONS.BOOKINGS, bookingId) as Booking | null;
  },

  async getBookingByPNR(pnr: string) {
    const bookings = await firestoreService.queryDocs(COLLECTIONS.BOOKINGS, [
      where('pnr', '==', pnr)
    ]);
    return bookings[0] as Booking | undefined;
  },

  async getUserBookings(userId: string) {
    return await firestoreService.queryDocs(COLLECTIONS.BOOKINGS, [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]) as Booking[];
  },

  async getTripBookings(tripId: string) {
    return await firestoreService.queryDocs(COLLECTIONS.BOOKINGS, [
      where('tripId', '==', tripId)
    ]) as Booking[];
  },

  async getAllBookings() {
    return await firestoreService.getAll(COLLECTIONS.BOOKINGS) as Booking[];
  },

  async getRecentBookings(limit: number = 5) {
    const bookings = await firestoreService.queryDocs(COLLECTIONS.BOOKINGS, [
      orderBy('createdAt', 'desc')
    ]);
    return bookings.slice(0, limit) as Booking[];
  },

  async updatePaymentStatus(bookingId: string, paymentStatus: Booking['paymentStatus']) {
    return await firestoreService.update(COLLECTIONS.BOOKINGS, bookingId, { paymentStatus });
  }
};
