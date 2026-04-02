import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { MapPin, Clock, Phone, Search } from 'lucide-react'
import './TrackBus.css'

const TrackBus = () => {
  const [pnr, setPnr] = useState('')
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      setTrackingData({
        pnr: pnr,
        busNumber: 'KA-01-AB-1234',
        route: 'Bangalore → Mumbai',
        status: 'On Time',
        currentLocation: 'Pune',
        departureTime: '10:00 AM',
        expectedArrival: '06:00 AM',
        nextStop: 'Mumbai',
        driver: {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210'
        }
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div>
      <Header />
      <div className="track-bus-page">
        <div className="container">
          <div className="track-header">
            <h1>Track Your Bus</h1>
            <p>Enter your PNR number to track your bus in real-time</p>
          </div>

          <div className="track-form-container">
            <form onSubmit={handleTrack} className="track-form">
              <input
                type="text"
                placeholder="Enter PNR Number"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                <Search size={20} /> Track Bus
              </button>
            </form>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Tracking your bus...</p>
            </div>
          )}

          {trackingData && !loading && (
            <div className="tracking-results">
              <div className="tracking-card">
                <div className="tracking-header">
                  <h2>Bus Details</h2>
                  <span className={`status-badge ${trackingData.status.toLowerCase().replace(' ', '-')}`}>
                    {trackingData.status}
                  </span>
                </div>

                <div className="tracking-info">
                  <div className="info-row">
                    <span className="label">PNR Number:</span>
                    <span className="value">{trackingData.pnr}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Bus Number:</span>
                    <span className="value">{trackingData.busNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Route:</span>
                    <span className="value">{trackingData.route}</span>
                  </div>
                </div>

                <div className="location-tracking">
                  <div className="location-item">
                    <MapPin size={24} className="icon" />
                    <div>
                      <h4>Current Location</h4>
                      <p>{trackingData.currentLocation}</p>
                    </div>
                  </div>
                  <div className="location-item">
                    <Clock size={24} className="icon" />
                    <div>
                      <h4>Expected Arrival</h4>
                      <p>{trackingData.expectedArrival}</p>
                    </div>
                  </div>
                </div>

                <div className="driver-info">
                  <h3>Driver Information</h3>
                  <div className="driver-details">
                    <p><strong>Name:</strong> {trackingData.driver.name}</p>
                    <p>
                      <Phone size={16} />
                      <strong>Contact:</strong> {trackingData.driver.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TrackBus
