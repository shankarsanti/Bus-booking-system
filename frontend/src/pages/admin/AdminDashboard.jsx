import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Bus, Users, BookOpen, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminDashboard = () => {
  const { buses, bookings } = useData()

  // Calculate real stats
  const totalBuses = buses.length
  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed')
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
  
  // Today's bookings
  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === today).length
  
  // Active routes (unique routes from buses)
  const activeRoutes = new Set(buses.map(b => `${b.from}-${b.to}`)).size
  
  // Total available seats across all buses
  const totalSeats = buses.reduce((sum, b) => sum + (b.availableSeats || 0), 0)

  // Get recent bookings (last 5)
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>
      
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">{totalBuses}</div>
              <div className="stat-label">Total Buses</div>
            </div>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <Bus size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">{totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <BookOpen size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">{totalSeats}</div>
              <div className="stat-label">Available Seats</div>
            </div>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">₹{totalRevenue > 1000 ? `${(totalRevenue / 1000).toFixed(1)}K` : totalRevenue}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">{todayBookings}</div>
              <div className="stat-label">Today's Bookings</div>
            </div>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">{activeRoutes}</div>
              <div className="stat-label">Active Routes</div>
            </div>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Recent Bookings</h2>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Passenger</th>
                <th>Route</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td><strong>{booking.id}</strong></td>
                  <td>{typeof booking.passenger === 'object' ? booking.passenger.name : booking.passenger}</td>
                  <td>{booking.route}</td>
                  <td>{booking.date}</td>
                  <td>₹{booking.amount || 0}</td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: booking.status === 'Confirmed' ? '#d4edda' : '#fff3cd',
                      color: booking.status === 'Confirmed' ? '#155724' : '#856404'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
