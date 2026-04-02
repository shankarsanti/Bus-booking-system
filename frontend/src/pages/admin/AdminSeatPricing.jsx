import React, { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Save, RotateCcw } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminSeatPricing = () => {
  const { buses } = useData()
  const [selectedBusId, setSelectedBusId] = useState(buses.length > 0 ? buses[0].id : null)
  
  // Initialize seat prices - load from localStorage or use defaults
  const getInitialPrices = (busId) => {
    const savedPrices = localStorage.getItem(`seatPrices_${busId}`)
    if (savedPrices) {
      return JSON.parse(savedPrices)
    }
    return {
      // Lower Deck
      L1: 850, L2: 850, L3: 680, L4: 680, L5: 850, L6: 850,
      L7: 680, L8: 680, L9: 680, L10: 680, L11: 680, L12: 680,
      L13: 850, L14: 680, L15: 680, L16: 850, L17: 850, L18: 850,
      // Upper Deck
      U1: 850, U2: 850, U3: 680, U4: 680, U5: 850, U6: 850,
      U7: 680, U8: 680, U9: 680, U10: 680, U11: 680, U12: 680,
      U13: 850, U14: 680, U15: 680, U16: 850, U17: 850, U18: 850
    }
  }

  const [seatPrices, setSeatPrices] = useState(getInitialPrices(selectedBusId))
  const [bulkPrice, setBulkPrice] = useState('')
  const [selectedSeats, setSelectedSeats] = useState([])

  // Handle bus change
  const handleBusChange = (busId) => {
    setSelectedBusId(busId)
    setSeatPrices(getInitialPrices(busId))
    setSelectedSeats([])
  }

  const selectedBus = buses.find(b => b.id === selectedBusId)

  const handlePriceChange = (seatId, price) => {
    const newPrices = {
      ...seatPrices,
      [seatId]: parseInt(price) || 0
    }
    setSeatPrices(newPrices)
    // Auto-save on change with bus-specific key
    localStorage.setItem(`seatPrices_${selectedBusId}`, JSON.stringify(newPrices))
    window.dispatchEvent(new Event('seatPricesUpdated'))
  }

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    )
  }

  const applyBulkPrice = () => {
    if (!bulkPrice || selectedSeats.length === 0) {
      alert('Please select seats and enter a price')
      return
    }
    
    const newPrices = { ...seatPrices }
    selectedSeats.forEach(seatId => {
      newPrices[seatId] = parseInt(bulkPrice)
    })
    
    setSeatPrices(newPrices)
    // Auto-save after bulk update
    localStorage.setItem(`seatPrices_${selectedBusId}`, JSON.stringify(newPrices))
    window.dispatchEvent(new Event('seatPricesUpdated'))
    
    setSelectedSeats([])
    setBulkPrice('')
    alert(`Price updated for ${selectedSeats.length} seats`)
  }

  const resetPrices = () => {
    if (window.confirm('Reset all prices to default?')) {
      const defaultPrices = {
        L1: 850, L2: 850, L3: 680, L4: 680, L5: 850, L6: 850,
        L7: 680, L8: 680, L9: 680, L10: 680, L11: 680, L12: 680,
        L13: 850, L14: 680, L15: 680, L16: 850, L17: 850, L18: 850,
        U1: 850, U2: 850, U3: 680, U4: 680, U5: 850, U6: 850,
        U7: 680, U8: 680, U9: 680, U10: 680, U11: 680, U12: 680,
        U13: 850, U14: 680, U15: 680, U16: 850, U17: 850, U18: 850
      }
      setSeatPrices(defaultPrices)
      localStorage.setItem(`seatPrices_${selectedBusId}`, JSON.stringify(defaultPrices))
      window.dispatchEvent(new Event('seatPricesUpdated'))
      setSelectedSeats([])
    }
  }

  const savePrices = () => {
    // Save to localStorage
    localStorage.setItem(`seatPrices_${selectedBusId}`, JSON.stringify(seatPrices))
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('seatPricesUpdated'))
    alert(`Seat prices saved successfully for ${selectedBus?.name}!`)
  }

  const renderSeat = (seatId) => {
    return (
      <div 
        key={seatId}
        className="seat-pricing-item"
        style={{
          border: selectedSeats.includes(seatId) ? '3px solid #28a745' : '2px solid #e0e0e0',
          borderRadius: '8px',
          padding: '12px',
          background: selectedSeats.includes(seatId) ? '#e8f5e9' : 'white',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        onClick={() => handleSeatSelect(seatId)}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span style={{ fontWeight: '700', fontSize: '14px' }}>{seatId}</span>
          <input
            type="checkbox"
            checked={selectedSeats.includes(seatId)}
            onChange={() => handleSeatSelect(seatId)}
            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '13px', color: '#666' }}>₹</span>
          <input
            type="number"
            value={seatPrices[seatId]}
            onChange={(e) => handlePriceChange(seatId, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          />
        </div>
      </div>
    )
  }

  const renderSeatGrid = (deck, rows) => {
    return (
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', color: '#1a73e8' }}>{deck}</h3>
        <div className="seat-pricing-layout">
          {rows.map((row, index) => {
            if (row === 'aisle') {
              return (
                <div key={`aisle-${index}`} className="pricing-aisle">
                  <div style={{ 
                    height: '2px', 
                    background: 'linear-gradient(to right, transparent 0%, #bbb 20%, #bbb 80%, transparent 100%)',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'white',
                      padding: '0 15px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#999',
                      letterSpacing: '2px'
                    }}>AISLE</span>
                  </div>
                </div>
              )
            }
            return (
              <div key={index} className="seat-pricing-row">
                {row.map(seatId => renderSeat(seatId))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Layout: Row 1 (L1-L6), Row 2 (L7-L12), Aisle, Row 3 (L13-L18)
  const lowerDeckLayout = [
    ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'],
    ['L7', 'L8', 'L9', 'L10', 'L11', 'L12'],
    'aisle',
    ['L13', 'L14', 'L15', 'L16', 'L17', 'L18']
  ]
  
  const upperDeckLayout = [
    ['U1', 'U2', 'U3', 'U4', 'U5', 'U6'],
    ['U7', 'U8', 'U9', 'U10', 'U11', 'U12'],
    'aisle',
    ['U13', 'U14', 'U15', 'U16', 'U17', 'U18']
  ]

  return (
    <AdminLayout>
      <style>{`
        .seat-pricing-layout {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .seat-pricing-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }
        
        .pricing-aisle {
          height: 30px;
          display: flex;
          align-items: center;
          margin: 10px 0;
        }
        
        @media (max-width: 768px) {
          .seat-pricing-row {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .seat-pricing-item {
            padding: 10px !important;
          }
          .pricing-aisle {
            height: 25px;
            margin: 8px 0;
          }
        }
        
        @media (max-width: 480px) {
          .seat-pricing-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .seat-pricing-item {
            padding: 8px !important;
          }
          .pricing-aisle {
            height: 20px;
            margin: 6px 0;
          }
        }
      `}</style>
      <div style={{ marginBottom: '30px' }}>
        <h1>Seat Pricing Management</h1>
        <p style={{ color: '#666', marginTop: '10px' }}>Set individual prices for each seat or update multiple seats at once</p>
      </div>

      {/* Bus Selector */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Select Bus</h3>
        <select
          value={selectedBusId || ''}
          onChange={(e) => handleBusChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600'
          }}
        >
          {buses.map(bus => (
            <option key={bus.id} value={bus.id}>
              {bus.name} - {bus.from} → {bus.to}
            </option>
          ))}
        </select>
        {selectedBus && (
          <div style={{ marginTop: '15px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <strong>Bus Type:</strong> {selectedBus.type} | <strong>Departure:</strong> {selectedBus.departureTime}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Update Section */}
      <div className="card" style={{ marginBottom: '30px', background: '#f8f9fa' }}>
        <h3 style={{ marginBottom: '15px' }}>Bulk Price Update</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Selected Seats: {selectedSeats.length}
            </label>
            <div style={{ 
              padding: '10px', 
              background: 'white', 
              border: '2px solid #e0e0e0', 
              borderRadius: '6px',
              minHeight: '42px',
              fontSize: '13px',
              color: selectedSeats.length > 0 ? '#333' : '#999',
              wordWrap: 'break-word'
            }}>
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
            </div>
          </div>
          <div style={{ minWidth: '150px', flex: '0 0 auto' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>New Price (₹)</label>
            <input
              type="number"
              placeholder="850"
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '6px',
                fontSize: '15px'
              }}
            />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={applyBulkPrice}
            disabled={selectedSeats.length === 0 || !bulkPrice}
            style={{ 
              opacity: selectedSeats.length === 0 || !bulkPrice ? 0.5 : 1,
              whiteSpace: 'nowrap'
            }}
          >
            Apply to Selected
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setSelectedSeats([])}
            disabled={selectedSeats.length === 0}
            style={{ 
              opacity: selectedSeats.length === 0 ? 0.5 : 1,
              whiteSpace: 'nowrap'
            }}
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-primary" 
          onClick={savePrices}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '150px', justifyContent: 'center' }}
        >
          <Save size={18} />
          Save All Prices
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={resetPrices}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '150px', justifyContent: 'center' }}
        >
          <RotateCcw size={18} />
          Reset to Default
        </button>
      </div>

      {/* Seat Grids */}
      <div className="card">
        {renderSeatGrid('Lower Deck', lowerDeckLayout)}
        {renderSeatGrid('Upper Deck', upperDeckLayout)}
      </div>

      {/* Price Summary */}
      <div className="card" style={{ marginTop: '30px', background: '#f8f9fa' }}>
        <h3 style={{ marginBottom: '15px' }}>Price Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Minimum Price</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#28a745' }}>
              ₹{Math.min(...Object.values(seatPrices))}
            </div>
          </div>
          <div style={{ padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Maximum Price</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f9a825' }}>
              ₹{Math.max(...Object.values(seatPrices))}
            </div>
          </div>
          <div style={{ padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Average Price</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a73e8' }}>
              ₹{Math.round(Object.values(seatPrices).reduce((a, b) => a + b, 0) / Object.values(seatPrices).length)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminSeatPricing
