import React, { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Plus, Edit, Trash2, Search, X, Tag, Percent, Calendar } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminOffers = () => {
  const { offers, setOffers } = useData()

  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    discount: '',
    type: 'percentage',
    minAmount: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    usageLimit: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setOffers(offers.map(offer => 
        offer.id === editingId 
          ? { ...offer, ...formData }
          : offer
      ))
      setEditingId(null)
    } else {
      const newOffer = {
        id: offers.length + 1,
        ...formData,
        usedCount: 0,
        status: 'Active'
      }
      setOffers([...offers, newOffer])
    }
    setShowForm(false)
    setFormData({
      code: '',
      title: '',
      discount: '',
      type: 'percentage',
      minAmount: '',
      maxDiscount: '',
      validFrom: '',
      validTo: '',
      usageLimit: ''
    })
  }

  const handleEdit = (offer) => {
    setFormData({
      code: offer.code,
      title: offer.title,
      discount: offer.discount,
      type: offer.type,
      minAmount: offer.minAmount,
      maxDiscount: offer.maxDiscount,
      validFrom: offer.validFrom,
      validTo: offer.validTo,
      usageLimit: offer.usageLimit
    })
    setEditingId(offer.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(offer => offer.id !== id))
    }
  }

  const filteredOffers = offers.filter(offer =>
    offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return { bg: '#d4edda', color: '#155724' }
      case 'Expired': return { bg: '#f8d7da', color: '#721c24' }
      case 'Inactive': return { bg: '#e2e3e5', color: '#383d41' }
      default: return { bg: '#e2e3e5', color: '#383d41' }
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Offers & Promotions</h1>
        <button className="btn btn-primary" onClick={() => {
          setShowForm(!showForm)
          if (showForm) {
            setEditingId(null)
            setFormData({
              code: '',
              title: '',
              discount: '',
              type: 'percentage',
              minAmount: '',
              maxDiscount: '',
              validFrom: '',
              validTo: '',
              usageLimit: ''
            })
          }
        }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'Add Offer'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            type="text"
            placeholder="Search offers by code or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 45px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px' }}
          />
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Offer' : 'Add New Offer'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Offer Code</label>
                <input
                  type="text"
                  placeholder="e.g., SAVE50"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px', textTransform: 'uppercase' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Offer Title</label>
                <input
                  type="text"
                  placeholder="e.g., Save 50% on First Booking"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Discount Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Discount Value {formData.type === 'percentage' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  placeholder={formData.type === 'percentage' ? '50' : '100'}
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Minimum Booking Amount (₹)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={formData.minAmount}
                  onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Maximum Discount (₹)</label>
                <input
                  type="number"
                  placeholder="200"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Valid From</label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Valid To</label>
                <input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Usage Limit</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                  required
                />
                <small style={{ color: '#666' }}>Maximum number of times this offer can be used</small>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {editingId ? 'Update Offer' : 'Save Offer'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredOffers.map(offer => {
          const statusStyle = getStatusColor(offer.status)
          const usagePercentage = (offer.usedCount / offer.usageLimit) * 100

          return (
            <div key={offer.id} className="card" style={{ padding: '25px', background: 'linear-gradient(135deg, #fbc02d 0%, #f57f17 100%)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Tag size={20} />
                    <h3 style={{ fontSize: '24px', margin: 0, fontWeight: '700' }}>{offer.code}</h3>
                  </div>
                  <p style={{ margin: 0, opacity: 0.95, fontSize: '15px' }}>{offer.title}</p>
                </div>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: statusStyle.bg,
                  color: statusStyle.color
                }}>
                  {offer.status}
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Percent size={24} />
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1' }}>
                      {offer.type === 'percentage' ? `${offer.discount}%` : `₹${offer.discount}`}
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>
                      {offer.type === 'percentage' ? 'OFF' : 'Flat Discount'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                  Min: ₹{offer.minAmount} • Max: ₹{offer.maxDiscount}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', opacity: 0.9 }}>
                  <Calendar size={14} />
                  <span>Valid: {offer.validFrom} to {offer.validTo}</span>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                    <span>Usage: {offer.usedCount} / {offer.usageLimit}</span>
                    <span>{usagePercentage.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${usagePercentage}%`, background: 'white', transition: 'width 0.3s' }}></div>
                  </div>
                </div>
              </div>

              <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary btn-small" onClick={() => handleEdit(offer)} style={{ flex: 1, background: 'white', color: '#f57f17' }}>
                  <Edit size={16} /> Edit
                </button>
                <button className="btn btn-primary btn-small" onClick={() => handleDelete(offer.id)} style={{ flex: 1, background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredOffers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          <Tag size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
          <p>No offers found matching your search</p>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminOffers
