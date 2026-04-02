import React, { useState } from 'react'
import './SeatLayout.css'

const SeatLayout = ({ totalSeats = 40, bookedSeats = [], onSeatSelect, busId }) => {
  const [selectedSeats, setSelectedSeats] = useState([])
  const [priceUpdate, setPriceUpdate] = useState(0)
  
  // Listen for storage changes to update prices
  React.useEffect(() => {
    const handleStorageChange = () => {
      setPriceUpdate(prev => prev + 1)
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event for same-tab updates
    window.addEventListener('seatPricesUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('seatPricesUpdated', handleStorageChange)
    }
  }, [])
  
  // Load seat prices from localStorage or use defaults
  const getSeatPrice = (seatId, busId) => {
    const savedPrices = localStorage.getItem(`seatPrices_${busId}`)
    if (savedPrices) {
      const prices = JSON.parse(savedPrices)
      return prices[seatId] || 680
    }
    // Default prices: window seats 850, others 680
    const windowSeats = ['L1', 'L2', 'L5', 'L6', 'L13', 'L16', 'L17', 'L18', 'U1', 'U2', 'U5', 'U6', 'U13', 'U16', 'U17', 'U18']
    return windowSeats.includes(seatId) ? 850 : 680
  }

  // Helper function to check if a seat is booked
  const isSeatBooked = (seatId) => {
    return bookedSeats.includes(seatId)
  }

  // Define seat layout for Lower Deck (L1-L18) in rows
  const lowerDeckSeats = [
    // Row 1
    [
      { id: 'L1', status: isSeatBooked('L1') ? 'booked' : (getSeatPrice('L1', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L1', busId) },
      { id: 'L2', status: isSeatBooked('L2') ? 'booked' : (getSeatPrice('L2', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L2', busId) },
      { id: 'L3', status: isSeatBooked('L3') ? 'booked' : (getSeatPrice('L3', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L3', busId) },
      { id: 'L4', status: isSeatBooked('L4') ? 'booked' : (getSeatPrice('L4', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L4', busId) },
      { id: 'L5', status: isSeatBooked('L5') ? 'booked' : (getSeatPrice('L5', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L5', busId) },
      { id: 'L6', status: isSeatBooked('L6') ? 'booked' : (getSeatPrice('L6', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L6', busId) }
    ],
    // Row 2
    [
      { id: 'L7', status: isSeatBooked('L7') ? 'booked' : (getSeatPrice('L7', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L7', busId) },
      { id: 'L8', status: isSeatBooked('L8') ? 'booked' : (getSeatPrice('L8', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L8', busId) },
      { id: 'L9', status: isSeatBooked('L9') ? 'booked' : (getSeatPrice('L9', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L9', busId) },
      { id: 'L10', status: isSeatBooked('L10') ? 'booked' : (getSeatPrice('L10', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L10', busId) },
      { id: 'L11', status: isSeatBooked('L11') ? 'booked' : (getSeatPrice('L11', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L11', busId) },
      { id: 'L12', status: isSeatBooked('L12') ? 'booked' : (getSeatPrice('L12', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L12', busId) }
    ],
    'aisle',
    // Row 3
    [
      { id: 'L13', status: isSeatBooked('L13') ? 'booked' : (getSeatPrice('L13', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L13', busId) },
      { id: 'L14', status: isSeatBooked('L14') ? 'booked' : (getSeatPrice('L14', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L14', busId) },
      { id: 'L15', status: isSeatBooked('L15') ? 'booked' : (getSeatPrice('L15', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L15', busId) },
      { id: 'L16', status: isSeatBooked('L16') ? 'booked' : (getSeatPrice('L16', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L16', busId) },
      { id: 'L17', status: isSeatBooked('L17') ? 'booked' : (getSeatPrice('L17', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L17', busId) },
      { id: 'L18', status: isSeatBooked('L18') ? 'booked' : (getSeatPrice('L18', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('L18', busId) }
    ]
  ]

  // Define seat layout for Upper Deck (U1-U18) - Same pattern as Lower Deck
  const upperDeckSeats = [
    // Row 1
    [
      { id: 'U1', status: isSeatBooked('U1') ? 'booked' : (getSeatPrice('U1', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U1', busId) },
      { id: 'U2', status: isSeatBooked('U2') ? 'booked' : (getSeatPrice('U2', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U2', busId) },
      { id: 'U3', status: isSeatBooked('U3') ? 'booked' : (getSeatPrice('U3', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U3', busId) },
      { id: 'U4', status: isSeatBooked('U4') ? 'booked' : (getSeatPrice('U4', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U4', busId) },
      { id: 'U5', status: isSeatBooked('U5') ? 'booked' : (getSeatPrice('U5', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U5', busId) },
      { id: 'U6', status: isSeatBooked('U6') ? 'booked' : (getSeatPrice('U6', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U6', busId) }
    ],
    // Row 2
    [
      { id: 'U7', status: isSeatBooked('U7') ? 'booked' : (getSeatPrice('U7', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U7', busId) },
      { id: 'U8', status: isSeatBooked('U8') ? 'booked' : (getSeatPrice('U8', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U8', busId) },
      { id: 'U9', status: isSeatBooked('U9') ? 'booked' : (getSeatPrice('U9', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U9', busId) },
      { id: 'U10', status: isSeatBooked('U10') ? 'booked' : (getSeatPrice('U10', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U10', busId) },
      { id: 'U11', status: isSeatBooked('U11') ? 'booked' : (getSeatPrice('U11', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U11', busId) },
      { id: 'U12', status: isSeatBooked('U12') ? 'booked' : (getSeatPrice('U12', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U12', busId) }
    ],
    'aisle',
    // Row 3
    [
      { id: 'U13', status: isSeatBooked('U13') ? 'booked' : (getSeatPrice('U13', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U13', busId) },
      { id: 'U14', status: isSeatBooked('U14') ? 'booked' : (getSeatPrice('U14', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U14', busId) },
      { id: 'U15', status: isSeatBooked('U15') ? 'booked' : (getSeatPrice('U15', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U15', busId) },
      { id: 'U16', status: isSeatBooked('U16') ? 'booked' : (getSeatPrice('U16', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U16', busId) },
      { id: 'U17', status: isSeatBooked('U17') ? 'booked' : (getSeatPrice('U17', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U17', busId) },
      { id: 'U18', status: isSeatBooked('U18') ? 'booked' : (getSeatPrice('U18', busId) > 680 ? 'special' : 'available'), price: getSeatPrice('U18', busId) }
    ]
  ]

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return
    
    let newSelected
    if (selectedSeats.includes(seat.id)) {
      newSelected = selectedSeats.filter(s => s !== seat.id)
    } else {
      newSelected = [...selectedSeats, seat.id]
    }
    
    setSelectedSeats(newSelected)
    onSeatSelect(newSelected)
  }

  const getSeatClassName = (seat) => {
    if (selectedSeats.includes(seat.id)) return 'seat selected'
    return `seat ${seat.status}`
  }

  const renderSeat = (seat) => {
    return (
      <div
        key={seat.id}
        className={getSeatClassName(seat)}
        onClick={() => handleSeatClick(seat)}
        style={{
          cursor: seat.status === 'booked' ? 'not-allowed' : 'pointer'
        }}
      >
        <div className="seat-icon">
          <div className="seat-inner-box"></div>
        </div>
        <span className="seat-label">{seat.id}</span>
      </div>
    )
  }
  
  const renderRow = (row, index) => {
    if (row === 'aisle' || typeof row === 'string') {
      return (
        <div key={`aisle-${index}`} className="aisle-row">
          <div className="aisle-line"></div>
        </div>
      )
    }
    
    if (Array.isArray(row)) {
      return (
        <div key={index} className="seat-row">
          {row.map((seat) => renderSeat(seat))}
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="seat-layout-container">
      {/* Deck Layout */}
      <div className="decks-container">
        {/* Lower Deck */}
        <div className="deck">
          <h3 className="deck-title">Lower Deck</h3>
          <div className="deck-content">
            <div className="seats-grid">
              {lowerDeckSeats.map((row, index) => renderRow(row, index))}
            </div>
          </div>
        </div>

        {/* Upper Deck */}
        <div className="deck">
          <h3 className="deck-title">Upper Deck</h3>
          <div className="deck-content">
            <div className="seats-grid">
              {upperDeckSeats.map((row, index) => renderRow(row, index))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SeatLayout
