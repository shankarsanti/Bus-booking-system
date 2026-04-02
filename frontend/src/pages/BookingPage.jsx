import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SeatLayout from '../components/SeatLayout'
import { useData } from '../context/DataContext'
import './BookingPage.css'

const BookingPage = () => {
  const { busId } = useParams()
  const navigate = useNavigate()
  const { buses, setBuses, bookings, setBookings } = useData()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  // Available coupons
  const coupons = [
    { code: 'FIRST10', discount: 10, type: 'percentage', description: '10% off on first booking' },
    { code: 'SAVE50', discount: 50, type: 'fixed', description: '₹50 off' },
    { code: 'SAVE100', discount: 100, type: 'fixed', description: '₹100 off' },
    { code: 'FLAT20', discount: 20, type: 'percentage', description: '20% off' }
  ]

  const bus = buses.find(b => String(b.id) === String(busId))
  
  if (!bus) {
    return <div>Bus not found</div>
  }

  // Get all booked seats for this specific bus
  const bookedSeats = bookings
    .filter(booking => {
      // Match by bus name and route
      const matchesBus = booking.busName === bus.name || 
                        (booking.bus && booking.bus.name === bus.name)
      const matchesRoute = booking.route === `${bus.from} → ${bus.to}` ||
                          (booking.bus && booking.bus.from === bus.from && booking.bus.to === bus.to)
      return matchesBus && matchesRoute && booking.status !== 'Cancelled'
    })
    .flatMap(booking => booking.seats || [])
    .filter((seat, index, self) => self.indexOf(seat) === index) // Remove duplicates

  // Get seat price from localStorage (bus-specific)
  const getSeatPrice = (seatId) => {
    const savedPrices = localStorage.getItem(`seatPrices_${busId}`)
    if (savedPrices) {
      const prices = JSON.parse(savedPrices)
      return prices[seatId] || 680
    }
    // Default prices: window seats 850, others 680
    const windowSeats = ['L1', 'L2', 'L5', 'L6', 'L13', 'L16', 'L17', 'L18', 'U1', 'U2', 'U5', 'U6', 'U13', 'U16', 'U17', 'U18']
    return windowSeats.includes(seatId) ? 850 : 680
  }

  // Calculate total price based on actual seat prices
  const subtotal = selectedSeats.reduce((total, seatId) => {
    return total + getSeatPrice(seatId)
  }, 0)

  // Calculate discount
  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discount) / 100)
    } else {
      discount = appliedCoupon.discount
    }
  }

  const totalPrice = Math.max(0, subtotal - discount)

  // Apply coupon
  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase())
    if (coupon) {
      setAppliedCoupon(coupon)
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code')
      setAppliedCoupon(null)
    }
  }

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  const handleBooking = (e) => {
    e.preventDefault()
    
    const newBooking = {
      id: `BK${Date.now()}`,
      busId: bus.id,
      passenger: passengerDetails.name,
      email: passengerDetails.email,
      phone: passengerDetails.phone,
      route: `${bus.from} → ${bus.to}`,
      busName: bus.name,
      date: new Date().toISOString().split('T')[0],
      time: bus.departureTime,
      seats: selectedSeats,
      amount: totalPrice,
      subtotal: subtotal,
      discount: discount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      status: 'Confirmed',
      paymentId: `PAY${Date.now()}`
    }
    
    // Add to global bookings
    setBookings([...bookings, newBooking])
    
    // Update available seats count for the bus
    setBuses(buses.map(b => 
      String(b.id) === String(busId) 
        ? { ...b, availableSeats: b.availableSeats - selectedSeats.length }
        : b
    ))
    
    alert('Booking confirmed!')
    navigate('/my-bookings')
  }

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: '40px 20px', minHeight: 'calc(100vh - 400px)' }}>
        <div className="booking-layout">
          <div className="booking-left">
            <div className="card bus-info-card">
              <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#333' }}>{bus.name}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#666' }}>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{bus.from} → {bus.to}</p>
                <p style={{ fontSize: '14px' }}>{bus.departureTime} - {bus.arrivalTime}</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#f9a825', marginTop: '5px' }}>
                  Seat prices: ₹680 - ₹850
                </p>
              </div>
            </div>
            
            <SeatLayout
              totalSeats={bus.totalSeats || 40}
              bookedSeats={bookedSeats}
              onSeatSelect={setSelectedSeats}
              busId={busId}
            />
          </div>
          
          <div className="booking-right">
            <div className="card passenger-details-card">
              <h3 style={{ marginBottom: '20px', fontSize: '20px', color: '#333' }}>Passenger Details</h3>
              <form onSubmit={handleBooking}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={passengerDetails.name}
                    onChange={(e) => setPassengerDetails({...passengerDetails, name: e.target.value})}
                    className="form-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={passengerDetails.email}
                    onChange={(e) => setPassengerDetails({...passengerDetails, email: e.target.value})}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={passengerDetails.phone}
                    onChange={(e) => setPassengerDetails({...passengerDetails, phone: e.target.value})}
                    className="form-input"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Coupon Code Section */}
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label>Have a Coupon Code?</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="form-input"
                      placeholder="Enter coupon code"
                      disabled={appliedCoupon !== null}
                      style={{ flex: 1 }}
                    />
                    {!appliedCoupon ? (
                      <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        className="btn btn-secondary"
                        disabled={!couponCode}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Apply
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="btn btn-secondary"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <p style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <p style={{ color: '#28a745', fontSize: '13px', marginTop: '5px', fontWeight: '600' }}>
                      ✓ {appliedCoupon.description} applied!
                    </p>
                  )}
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    <p style={{ fontWeight: '600', marginBottom: '5px' }}>Available Coupons:</p>
                    {coupons.map(c => (
                      <div key={c.code} style={{ marginBottom: '3px' }}>
                        <strong>{c.code}</strong> - {c.description}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="booking-summary">
                  <p style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                    Selected Seats: <strong>{selectedSeats.join(', ') || 'None'}</strong>
                  </p>
                  {selectedSeats.length > 0 && (
                    <div style={{ marginTop: '10px', marginBottom: '10px', fontSize: '13px', color: '#666' }}>
                      {selectedSeats.map(seatId => (
                        <div key={seatId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>{seatId}</span>
                          <span>₹{getSeatPrice(seatId)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ paddingTop: '10px', borderTop: '2px solid #e0e0e0', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                      <span>Subtotal:</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {appliedCoupon && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#28a745', marginBottom: '5px' }}>
                        <span>Discount ({appliedCoupon.code}):</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#f9a825', marginTop: '10px' }}>
                      Total: ₹{totalPrice}
                    </p>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary booking-confirm-btn" 
                  disabled={selectedSeats.length === 0}
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BookingPage
