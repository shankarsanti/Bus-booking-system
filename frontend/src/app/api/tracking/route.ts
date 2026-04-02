import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BusLocation, TrackingUpdate } from '@/types/features';

export interface UpdateLocationRequest {
  tripId: string;
  busId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
}

export interface CreateTrackingUpdateRequest {
  tripId: string;
  status: TrackingUpdate['status'];
  currentStop?: string;
  nextStop?: string;
  estimatedArrival?: Date;
  delay?: number;
  message?: string;
}

// Update bus location
export async function updateBusLocation(data: UpdateLocationRequest) {
  try {
    // Check if location record exists for this trip
    const q = query(
      collection(db, 'busLocations'),
      where('tripId', '==', data.tripId)
    );

    const snapshot = await getDocs(q);

    const locationData: Omit<BusLocation, 'id'> = {
      ...data,
      lastUpdated: new Date() as any
    };

    if (snapshot.empty) {
      // Create new location record
      const docRef = await addDoc(collection(db, 'busLocations'), locationData);
      return { id: docRef.id, ...locationData };
    } else {
      // Update existing location record
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, locationData as any);
      return { id: docRef.id, ...locationData };
    }
  } catch (error) {
    console.error('Error updating bus location:', error);
    throw new Error('Failed to update bus location');
  }
}

// Get bus location
export async function getBusLocation(tripId: string) {
  try {
    const q = query(
      collection(db, 'busLocations'),
      where('tripId', '==', tripId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BusLocation;
  } catch (error) {
    console.error('Error fetching bus location:', error);
    throw new Error('Failed to fetch bus location');
  }
}

// Create tracking update
export async function createTrackingUpdate(data: CreateTrackingUpdateRequest) {
  try {
    const update: Omit<TrackingUpdate, 'id'> = {
      ...data,
      estimatedArrival: data.estimatedArrival as any,
      createdAt: new Date() as any
    };

    const docRef = await addDoc(collection(db, 'trackingUpdates'), update);
    return { id: docRef.id, ...update };
  } catch (error) {
    console.error('Error creating tracking update:', error);
    throw new Error('Failed to create tracking update');
  }
}

// Get tracking updates for trip
export async function getTrackingUpdates(tripId: string, limitCount: number = 10) {
  try {
    const q = query(
      collection(db, 'trackingUpdates'),
      where('tripId', '==', tripId),
      orderBy('createdAt', 'desc'),
      firestoreLimit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrackingUpdate));
  } catch (error) {
    console.error('Error fetching tracking updates:', error);
    throw new Error('Failed to fetch tracking updates');
  }
}

// Get latest tracking status
export async function getLatestTrackingStatus(tripId: string) {
  try {
    const updates = await getTrackingUpdates(tripId, 1);
    return updates.length > 0 ? updates[0] : null;
  } catch (error) {
    console.error('Error fetching latest tracking status:', error);
    throw new Error('Failed to fetch tracking status');
  }
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Estimate arrival time based on current location and destination
export async function estimateArrival(
  tripId: string,
  destinationLat: number,
  destinationLon: number,
  averageSpeed: number = 50 // km/h
) {
  try {
    const location = await getBusLocation(tripId);

    if (!location) {
      throw new Error('Bus location not available');
    }

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      destinationLat,
      destinationLon
    );

    const timeInHours = distance / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);

    const estimatedArrival = new Date();
    estimatedArrival.setMinutes(estimatedArrival.getMinutes() + timeInMinutes);

    return {
      distance: Math.round(distance * 10) / 10,
      estimatedTime: timeInMinutes,
      estimatedArrival
    };
  } catch (error) {
    console.error('Error estimating arrival:', error);
    throw new Error('Failed to estimate arrival');
  }
}
