import React, { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Search, UserPlus, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { users, setUsers } = useData()

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  const handleToggleStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ))
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Users</h1>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={20} /> Add User
        </button>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            type="text"
            placeholder="Search by name, email, phone, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 45px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {filteredUsers.map(user => (
          <div key={user.id} className="card" style={{ padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ marginBottom: '8px', fontSize: '20px' }}>{user.name}</h3>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: user.status === 'Active' ? '#d4edda' : '#f8d7da',
                  color: user.status === 'Active' ? '#155724' : '#721c24'
                }}>
                  {user.status}
                </span>
              </div>
              <div className="action-buttons">
                <button className="btn btn-secondary btn-small" onClick={() => handleToggleStatus(user.id)} title={user.status === 'Active' ? 'Deactivate' : 'Activate'}>
                  <Edit size={16} />
                </button>
                <button className="btn btn-primary btn-small" onClick={() => handleDelete(user.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#666' }}>
                <Mail size={16} />
                <span style={{ fontSize: '14px' }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#666' }}>
                <Phone size={16} />
                <span style={{ fontSize: '14px' }}>{user.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666' }}>
                <MapPin size={16} />
                <span style={{ fontSize: '14px' }}>{user.city}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#f9a825' }}>{user.totalBookings}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Total Bookings</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#f9a825' }}>₹{(user.totalSpent / 1000).toFixed(1)}K</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Total Spent</div>
              </div>
            </div>

            <div style={{ marginTop: '15px', fontSize: '13px', color: '#999' }}>
              Joined: {user.joinDate}
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          <UserPlus size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
          <p>No users found matching your search</p>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminUsers
