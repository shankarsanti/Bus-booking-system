import React, { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Plus, Edit, Trash2, Search, X, MapPin, Clock, Navigation } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminRoutes = () => {
  const { routes, setRoutes } = useData()
  
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    distance: '',
    duration: '',
    stops: '',
    basePrice: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setRoutes(routes.map(route => 
        route.id === editingId 
          ? { 
              ...route, 
              ...formData,
              stops: formData.stops.split(',').map(s => s.trim()).filter(s => s)
            }
          : route
      ))
      setEditingId(null)
    } else {
      const newRoute = {
        id: routes.length + 1,
        ...formData,
        stops: formData.stops.split(',').map(s => s.trim()).filter(s => s),
        activeBuses: 0
      }
      setRoutes([...routes, newRoute])
    }
    setShowForm(false)
    setFormData({
      from: '',
      to: '',
      distance: '',
      duration: '',
      stops: '',
      basePrice: ''
    })
  }

  const handleEdit = (route) => {
    setFormData({
      from: route.from,
      to: route.to,
      distance: route.distance,
      duration: route.duration,
      stops: Array.isArray(route.stops) ? route.stops.join(', ') : '',
      basePrice: route.basePrice
    })
    setEditingId(route.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter(route => route.id !== id))
    }
  }

  const filteredRoutes = routes.filter(route =>
    route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.to.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Routes</h1>
        <button className="btn btn-primary" onClick={() => {
          setShowForm(!showForm)
          if (showForm) {
            setEditingId(null)
            setFormData({
              from: '',
              to: '',
              distance: '',
              duration: '',
              stops: '',
              basePrice: ''
            })
          }
        }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'Add Route'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            type="text"
            placeholder="Search routes by source or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 45px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px' }}
          />
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Route' : 'Add New Route'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>From</label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai"
                  value={formData.from}
                  onChange={(e) => setFormData({...formData, from: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>To</label>
                <input
                  type="text"
                  placeholder="e.g., Pune"
                  value={formData.to}
                  onChange={(e) => setFormData({...formData, to: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Distance</label>
                <input
                  type="text"
                  placeholder="e.g., 150 km"
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 3h"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Base Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g., 850"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Stops (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Lonavala, Khandala"
                  value={formData.stops}
                  onChange={(e) => setFormData({...formData, stops: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {editingId ? 'Update Route' : 'Save Route'}
            </button>
          </form>
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredRoutes.map(route => (
          <div key={route.id} className="card" style={{ padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#333' }}>
                  {route.from} → {route.to}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '14px' }}>
                  <Navigation size={14} />
                  <span>{route.distance}</span>
                  <span>•</span>
                  <Clock size={14} />
                  <span>{route.duration}</span>
                </div>
              </div>
              <div className="action-buttons">
                <button className="btn btn-secondary btn-small" onClick={() => handleEdit(route)}><Edit size={16} /></button>
                <button className="btn btn-primary btn-small" onClick={() => handleDelete(route.id)}><Trash2 size={16} /></button>
              </div>
            </div>

            {route.stops && route.stops.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                  <MapPin size={14} />
                  <span>Stops</span>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {route.stops.join(' • ')}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#f9a825' }}>{route.activeBuses}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Active Buses</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#f9a825' }}>₹{route.basePrice}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Base Price</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          <p>No routes found matching your search</p>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminRoutes
