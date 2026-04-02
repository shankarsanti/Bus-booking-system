import Header from '../components/Header'
import Footer from '../components/Footer'
import { Calendar, MapPin, Users } from 'lucide-react'
import { useData } from '../context/DataContext'

const MyBookings = () => {
  const { bookings } = useData()

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: '40px 20px', minHeight: 'calc(100vh - 400px)' }}>
        <h2 style={{ marginBottom: '30px' }}>My Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p>No bookings found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bookings.map(booking => {
              // Handle both old and new booking formats
              const busName = booking.busName || booking.bus?.name || 'N/A'
              const route = booking.route || (booking.bus ? `${booking.bus.from} → ${booking.bus.to}` : 'N/A')
              
              // Extract passenger info - check if it's a string or object
              const passengerName = typeof booking.passenger === 'string' 
                ? booking.passenger 
                : booking.passenger?.name || 'N/A'
              const email = booking.email || booking.passenger?.email || 'N/A'
              const phone = booking.phone || booking.passenger?.phone || 'N/A'
              
              const seats = Array.isArray(booking.seats) ? booking.seats : []
              const amount = booking.amount || booking.totalPrice || 0
              const date = booking.date || (booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A')
              const status = booking.status || 'Confirmed'
              
              return (
                <div key={booking.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3>{busName}</h3>
                    <span style={{ 
                      color: status === 'Confirmed' ? '#4caf50' : status === 'Pending' ? '#ff9800' : '#f44336', 
                      fontWeight: 'bold' 
                    }}>
                      {status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                        <MapPin size={18} />
                        <span>{route}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                        <Calendar size={18} />
                        <span>{date}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                        <Users size={18} />
                        <span>Seats: {seats.length > 0 ? seats.join(', ') : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c' }}>
                        ₹{amount}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                    <p><strong>Passenger:</strong> {passengerName}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Phone:</strong> {phone}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default MyBookings
