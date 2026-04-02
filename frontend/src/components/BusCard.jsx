import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, Users, Star } from 'lucide-react'
import './BusCard.css'

const BusCard = ({ bus }) => {
  const navigate = useNavigate()

  // Get minimum seat price from localStorage (bus-specific)
  const getMinimumPrice = () => {
    const savedPrices = localStorage.getItem(`seatPrices_${bus.id}`)
    if (savedPrices) {
      const prices = JSON.parse(savedPrices)
      const allPrices = Object.values(prices)
      return Math.min(...allPrices)
    }
    return 680 // Default minimum price
  }

  const minimumPrice = getMinimumPrice()

  return (
    <div className="bus-card">
      <div className="bus-info">
        <div className="bus-header">
          <h3>{bus.name}</h3>
          <div className="bus-type">{bus.type}</div>
        </div>
        
        <div className="bus-details">
          <div className="detail-item">
            <Clock size={18} />
            <span>{bus.departureTime} - {bus.arrivalTime}</span>
          </div>
          <div className="detail-item">
            <MapPin size={18} />
            <span>{bus.from} → {bus.to}</span>
          </div>
          <div className="detail-item">
            <Users size={18} />
            <span>{bus.availableSeats} seats available</span>
          </div>
          <div className="detail-item">
            <Star size={18} fill="#ffc107" color="#ffc107" />
            <span>{bus.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="bus-action">
        <div className="price">
          <span className="price-label">Starting from</span>
          <span className="price-value">₹{minimumPrice}</span>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/booking/${bus.id}`)}
        >
          View Seats
        </button>
      </div>
    </div>
  )
}

export default BusCard
