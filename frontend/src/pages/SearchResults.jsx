import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BusCard from '../components/BusCard'
import { useData } from '../context/DataContext'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const { buses: allBuses } = useData()
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')
    
    setTimeout(() => {
      // Filter buses based on search criteria
      let filteredBuses = allBuses
      
      if (from || to) {
        filteredBuses = allBuses.filter(bus => {
          const matchFrom = !from || bus.from.toLowerCase().includes(from.toLowerCase())
          const matchTo = !to || bus.to.toLowerCase().includes(to.toLowerCase())
          return matchFrom && matchTo
        })
      }
      
      // If no matches found, show all buses
      if (filteredBuses.length === 0) {
        filteredBuses = allBuses
      }
      
      setBuses(filteredBuses)
      setLoading(false)
    }, 500)
  }, [searchParams, allBuses])

  const from = searchParams.get('from')
  const to = searchParams.get('to')

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: '40px 20px', minHeight: 'calc(100vh - 400px)' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>
            Available Buses
          </h2>
          {(from || to) && (
            <p style={{ color: '#666', fontSize: '16px' }}>
              {from && to ? `${from} → ${to}` : from || to}
            </p>
          )}
          <p style={{ color: '#999', fontSize: '14px' }}>
            Showing {buses.length} {buses.length === 1 ? 'bus' : 'buses'}
          </p>
        </div>
        
        {loading ? (
          <div className="loading">Loading buses...</div>
        ) : buses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {buses.map(bus => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p>No buses available at the moment. Please check back later or try a different route.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default SearchResults
