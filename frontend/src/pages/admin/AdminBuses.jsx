import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { Plus, Edit, Trash2, Search, X, Wifi, Tv, Coffee, Zap } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminBuses = () => {
  const { buses, setBuses } = useData()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    busNumber: '',
    type: 'AC Sleeper',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    amenities: []
  })

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'charging', label: 'Charging Point', icon: Zap },
    { id: 'refreshments', label: 'Refreshments', icon: Coffee }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setBuses(buses.map(bus => 
        bus.id === editingId 
          ? { ...bus, ...formData }
          : bus
      ))
      setEditingId(null)
    } else {
      const newBus = {
        id: String(buses.length + 1),
        ...formData,
        totalSeats: 36,
        availableSeats: 36,
        price: 680, // Base price, actual prices from Seat Pricing Management
        rating: 4.5
      }
      setBuses([...buses, newBus])
    }
    setShowForm(false)
    setFormData({
      name: '',
      busNumber: '',
      type: 'AC Sleeper',
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
      amenities: []
    })
  }

  const handleEdit = (bus) => {
    setFormData({
      name: bus.name,
      busNumber: bus.busNumber || '',
      type: bus.type,
      from: bus.from,
      to: bus.to,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      amenities: bus.amenities || []
    })
    setEditingId(bus.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      setBuses(buses.filter(bus => bus.id !== id))
    }
  }

  const filteredBuses = buses.filter(bus =>
    bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.to.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleAmenity = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h1>Manage Buses</h1>
          <button className="btn btn-primary" onClick={() => {
          setShowForm(!showForm)
          if (showForm) {
            setEditingId(null)
            setFormData({
              name: '',
              busNumber: '',
              type: 'AC Sleeper',
              totalSeats: 40,
              from: '',
              to: '',
              departureTime: '',
              arrivalTime: '',
              price: '',
              amenities: []
            })
          }
        }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'Add Bus'}
        </button>
        </div>
        <div style={{ padding: '12px 20px', background: '#e3f2fd', border: '2px solid #1a73e8', borderRadius: '8px', fontSize: '14px', color: '#1565c0' }}>
          <strong>Note:</strong> Seat pricing is managed separately in the <Link to="/admin/seat-pricing" style={{ color: '#1a73e8', fontWeight: '600', textDecoration: 'underline' }}>Seat Pricing Management</Link> section.
        </div>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            type="text"
            placeholder="Search buses by name or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 45px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px' }}
          />
        </div>
      </div>
      
      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Bus' : 'Add New Bus'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bus Name</label>
                <input
                  type="text"
                  placeholder="e.g., Shivneri Express"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bus Number</label>
                <input
                  type="text"
                  placeholder="e.g., MH-12-AB-1234"
                  value={formData.busNumber}
                  onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bus Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                >
                  <option>AC Sleeper</option>
                  <option>Non-AC Sleeper</option>
                  <option>AC Seater</option>
                  <option>Non-AC Seater</option>
                </select>
              </div>
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Departure Time</label>
                <input
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Arrival Time</label>
                <input
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Amenities</label>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {amenitiesList.map(amenity => (
                  <label key={amenity.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 15px', border: '2px solid #e0e0e0', borderRadius: '8px', background: formData.amenities.includes(amenity.id) ? '#f9a825' : 'white', color: formData.amenities.includes(amenity.id) ? 'white' : '#333' }}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.id)}
                      onChange={() => toggleAmenity(amenity.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <amenity.icon size={16} />
                    <span>{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {editingId ? 'Update Bus' : 'Save Bus'}
            </button>
          </form>
        </div>
      )}
      
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Bus Name</th>
              <th>Bus Number</th>
              <th>Type</th>
              <th>Route</th>
              <th>Timing</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuses.map(bus => (
              <tr key={bus.id}>
                <td><strong>{bus.name}</strong></td>
                <td>{bus.busNumber || 'N/A'}</td>
                <td>{bus.type}</td>
                <td>{bus.from} → {bus.to}</td>
                <td>
                  <div style={{ fontSize: '13px' }}>
                    <div>{bus.departureTime}</div>
                    <div style={{ color: '#999' }}>to {bus.arrivalTime}</div>
                  </div>
                </td>
                <td>{bus.availableSeats}/{bus.totalSeats || 36}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary btn-small" onClick={() => handleEdit(bus)}><Edit size={16} /></button>
                    <button className="btn btn-primary btn-small" onClick={() => handleDelete(bus.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBuses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          <p>No buses found matching your search</p>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminBuses
