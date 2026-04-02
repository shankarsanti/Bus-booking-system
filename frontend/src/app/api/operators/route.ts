import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Operator } from '@/types/features';

export interface CreateOperatorRequest {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address?: string;
  licenseNumber: string;
  gstNumber?: string;
  panNumber?: string;
  bankDetails?: Operator['bankDetails'];
}

export interface UpdateOperatorRequest extends Partial<CreateOperatorRequest> {
  status?: Operator['status'];
  verificationStatus?: Operator['verificationStatus'];
}

// Create operator
export async function createOperator(data: CreateOperatorRequest) {
  try {
    // Check if operator with same email or license exists
    const emailQuery = query(
      collection(db, 'operators'),
      where('email', '==', data.email)
    );
    const emailSnap = await getDocs(emailQuery);

    if (!emailSnap.empty) {
      throw new Error('Operator with this email already exists');
    }

    const licenseQuery = query(
      collection(db, 'operators'),
      where('licenseNumber', '==', data.licenseNumber)
    );
    const licenseSnap = await getDocs(licenseQuery);

    if (!licenseSnap.empty) {
      throw new Error('Operator with this license number already exists');
    }

    const operator: Omit<Operator, 'id'> = {
      ...data,
      busIds: [],
      status: 'inactive',
      verificationStatus: 'pending',
      createdAt: new Date() as any
    };

    const docRef = await addDoc(collection(db, 'operators'), operator);
    return { id: docRef.id, ...operator };
  } catch (error: any) {
    console.error('Error creating operator:', error);
    throw new Error(error.message || 'Failed to create operator');
  }
}

// Get operator by ID
export async function getOperator(operatorId: string) {
  try {
    const operatorRef = doc(db, 'operators', operatorId);
    const operatorSnap = await getDoc(operatorRef);

    if (!operatorSnap.exists()) {
      throw new Error('Operator not found');
    }

    return { id: operatorSnap.id, ...operatorSnap.data() } as Operator;
  } catch (error: any) {
    console.error('Error fetching operator:', error);
    throw new Error(error.message || 'Failed to fetch operator');
  }
}

// Get all operators
export async function getOperators(filters?: {
  status?: Operator['status'];
  verificationStatus?: Operator['verificationStatus'];
}) {
  try {
    let q = query(collection(db, 'operators'));

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters?.verificationStatus) {
      q = query(q, where('verificationStatus', '==', filters.verificationStatus));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Operator));
  } catch (error) {
    console.error('Error fetching operators:', error);
    throw new Error('Failed to fetch operators');
  }
}

// Update operator
export async function updateOperator(operatorId: string, data: UpdateOperatorRequest) {
  try {
    const operatorRef = doc(db, 'operators', operatorId);
    const operatorSnap = await getDoc(operatorRef);

    if (!operatorSnap.exists()) {
      throw new Error('Operator not found');
    }

    await updateDoc(operatorRef, {
      ...data,
      updatedAt: new Date()
    } as any);

    return await getOperator(operatorId);
  } catch (error: any) {
    console.error('Error updating operator:', error);
    throw new Error(error.message || 'Failed to update operator');
  }
}

// Delete operator
export async function deleteOperator(operatorId: string) {
  try {
    const operator = await getOperator(operatorId);

    // Check if operator has buses
    if (operator.busIds && operator.busIds.length > 0) {
      throw new Error('Cannot delete operator with assigned buses');
    }

    const operatorRef = doc(db, 'operators', operatorId);
    await deleteDoc(operatorRef);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting operator:', error);
    throw new Error(error.message || 'Failed to delete operator');
  }
}

// Assign bus to operator
export async function assignBusToOperator(operatorId: string, busId: string) {
  try {
    const operator = await getOperator(operatorId);

    if (operator.busIds.includes(busId)) {
      throw new Error('Bus already assigned to this operator');
    }

    const updatedBusIds = [...operator.busIds, busId];

    const operatorRef = doc(db, 'operators', operatorId);
    await updateDoc(operatorRef, {
      busIds: updatedBusIds,
      updatedAt: new Date()
    });

    // Update bus with operator ID
    const busRef = doc(db, 'buses', busId);
    await updateDoc(busRef, {
      operatorId: operatorId
    });

    return { success: true, busIds: updatedBusIds };
  } catch (error: any) {
    console.error('Error assigning bus:', error);
    throw new Error(error.message || 'Failed to assign bus');
  }
}

// Remove bus from operator
export async function removeBusFromOperator(operatorId: string, busId: string) {
  try {
    const operator = await getOperator(operatorId);

    if (!operator.busIds.includes(busId)) {
      throw new Error('Bus not assigned to this operator');
    }

    const updatedBusIds = operator.busIds.filter(id => id !== busId);

    const operatorRef = doc(db, 'operators', operatorId);
    await updateDoc(operatorRef, {
      busIds: updatedBusIds,
      updatedAt: new Date()
    });

    // Remove operator ID from bus
    const busRef = doc(db, 'buses', busId);
    await updateDoc(busRef, {
      operatorId: null
    });

    return { success: true, busIds: updatedBusIds };
  } catch (error: any) {
    console.error('Error removing bus:', error);
    throw new Error(error.message || 'Failed to remove bus');
  }
}

// Get operator statistics
export async function getOperatorStats(operatorId: string) {
  try {
    const operator = await getOperator(operatorId);

    // Get all trips for operator's buses
    const tripsQuery = query(
      collection(db, 'trips'),
      where('busId', 'in', operator.busIds.length > 0 ? operator.busIds : [''])
    );
    const tripsSnap = await getDocs(tripsQuery);

    // Get all bookings for operator's trips
    const tripIds = tripsSnap.docs.map(doc => doc.id);
    let totalBookings = 0;
    let totalRevenue = 0;

    if (tripIds.length > 0) {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('tripId', 'in', tripIds)
      );
      const bookingsSnap = await getDocs(bookingsQuery);

      totalBookings = bookingsSnap.size;
      totalRevenue = bookingsSnap.docs.reduce((sum, doc) => {
        return sum + (doc.data().totalAmount || 0);
      }, 0);
    }

    return {
      totalBuses: operator.busIds.length,
      totalTrips: tripsSnap.size,
      totalBookings,
      totalRevenue,
      rating: operator.rating || 0
    };
  } catch (error) {
    console.error('Error fetching operator stats:', error);
    throw new Error('Failed to fetch operator statistics');
  }
}
