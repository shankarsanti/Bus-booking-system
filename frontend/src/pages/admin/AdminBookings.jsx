import React, { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Search, Filter, Eye, CheckCircle, XCircle, Download } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { bookings, setBookings } = useData()

  const filteredBookings = bookings.filter(booking => {
    const passengerName = typeof booking.passenger === 'string' ? booking.passenger : booking.passenger?.name || ''
    const matchesSearch = passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (booking.phone && booking.phone.includes(searchTerm))
    const matchesFilter = filterStatus === 'all' || booking.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    if (!status) return { bg: '#e2e3e5', color: '#383d41' }
    
    switch(status.toLowerCase()) {
      case 'confirmed': return { bg: '#d4edda', color: '#155724' }
      case 'pending': return { bg: '#fff3cd', color: '#856404' }
      case 'cancelled': return { bg: '#f8d7da', color: '#721c24' }
      default: return { bg: '#e2e3e5', color: '#383d41' }
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Bookings</h1>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={20} /> Export Report
        </button>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '15px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              placeholder="Search by booking ID, passenger name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 45px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={20} color="#666" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '12px 20px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Passenger Details</th>
              <th>Route</th>
              <th>Bus</th>
              <th>Date & Time</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => {
              const statusStyle = getStatusColor(booking.status)
              return (
                <tr key={booking.id}>
                  <td><strong>{booking.id}</strong></td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {typeof booking.passenger === 'string' ? booking.passenger : booking.passenger?.name || 'N/A'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>{booking.phone}</div>
                    </div>
                  </td>
                  <td>{booking.route}</td>
                  <td>{booking.busName}</td>
                  <td>
                    <div>
                      <div>{booking.date}</div>
                      <div style={{ fontSize: '13px', color: '#666' }}>{booking.time}</div>
                    </div>
                  </td>
                  <td>{booking.seats.join(', ')}</td>
                  <td><strong>₹{booking.amount}</strong></td>
                  <td>
                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '14px',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      display: 'inline-block'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-secondary btn-small" title="View Details">
                        <Eye size={16} />
                      </button>
                      {booking.status === 'Pending' && (
                        <>
                          <button className="btn btn-primary btn-small" title="Confirm" style={{ background: '#28a745' }}>
                            <CheckCircle size={16} />
                          </button>
                          <button className="btn btn-primary btn-small" title="Cancel" style={{ background: '#dc3545' }}>
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          <BookOpen size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
          <p>No bookings found matching your criteria</p>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminBookings
