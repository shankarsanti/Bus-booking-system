import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockBuses } from '../utils/mockData'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  // Initialize from localStorage or use defaults
  const [buses, setBuses] = useState(() => {
    const saved = localStorage.getItem('buses')
    return saved ? JSON.parse(saved) : mockBuses
  })

  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem('offers')
    return saved ? JSON.parse(saved) : [
      { id: 1, code: 'FIRST50', title: 'First Booking Offer', discount: 50, type: 'percentage', minAmount: 500, maxDiscount: 200, validFrom: '2024-01-01', validTo: '2024-12-31', usageLimit: 1000, usedCount: 234, status: 'Active' },
      { id: 2, code: 'SAVE100', title: 'Flat ₹100 Off', discount: 100, type: 'flat', minAmount: 800, maxDiscount: 100, validFrom: '2024-01-01', validTo: '2024-06-30', usageLimit: 500, usedCount: 156, status: 'Active' },
      { id: 3, code: 'WEEKEND20', title: 'Weekend Special', discount: 20, type: 'percentage', minAmount: 600, maxDiscount: 150, validFrom: '2024-01-01', validTo: '2024-12-31', usageLimit: 2000, usedCount: 789, status: 'Active' },
      { id: 4, code: 'NEWYEAR', title: 'New Year Offer', discount: 30, type: 'percentage', minAmount: 1000, maxDiscount: 300, validFrom: '2024-01-01', validTo: '2024-01-15', usageLimit: 100, usedCount: 100, status: 'Expired' }
    ]
  })

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users')
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '9876543210', city: 'Mumbai', totalBookings: 12, totalSpent: 15600, joinDate: '2023-06-15', status: 'Active' },
      { id: 2, name: 'Priya Sharma', email: 'priya@email.com', phone: '9876543211', city: 'Delhi', totalBookings: 8, totalSpent: 9800, joinDate: '2023-07-20', status: 'Active' }
    ]
  })

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('bookings')
    return saved ? JSON.parse(saved) : [
      { id: 'BK001', passenger: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '9876543210', route: 'Mumbai → Pune', busName: 'Volvo Multi-Axle', date: '2024-01-15', time: '08:00 AM', seats: ['A1', 'A2'], amount: 1700, status: 'Confirmed', paymentId: 'PAY123456' },
      { id: 'BK002', passenger: 'Priya Sharma', email: 'priya@email.com', phone: '9876543211', route: 'Mumbai → Pune', busName: 'Scania Multi-Axle', date: '2024-01-15', time: '10:30 AM', seats: ['B3'], amount: 1200, status: 'Confirmed', paymentId: 'PAY123457' }
    ]
  })

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('buses', JSON.stringify(buses))
  }, [buses])

  useEffect(() => {
    localStorage.setItem('offers', JSON.stringify(offers))
  }, [offers])

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings))
  }, [bookings])

  const value = {
    buses,
    setBuses,
    offers,
    setOffers,
    users,
    setUsers,
    bookings,
    setBookings
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
