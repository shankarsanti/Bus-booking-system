import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Search, ArrowLeftRight } from 'lucide-react'
import './SearchForm.css'

const SearchForm = () => {
  const navigate = useNavigate()
  const [tripType, setTripType] = useState('oneway')
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/search?from=${formData.from}&to=${formData.to}&date=${formData.date}`)
  }

  const swapLocations = () => {
    setFormData({
      ...formData,
      from: formData.to,
      to: formData.from
    })
  }

  const setDateShortcut = (days) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    setFormData({...formData, date: date.toISOString().split('T')[0]})
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-inputs">
        <div className="form-group">
          <div className="input-wrapper">
            <MapPin size={20} className="input-icon" />
            <input
              type="text"
              placeholder="Source"
              value={formData.from}
              onChange={(e) => setFormData({...formData, from: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="swap-container">
          <button type="button" className="swap-btn" onClick={swapLocations}>
            <ArrowLeftRight size={18} />
          </button>
        </div>
        
        <div className="form-group">
          <div className="input-wrapper">
            <MapPin size={20} className="input-icon" />
            <input
              type="text"
              placeholder="Destination"
              value={formData.to}
              onChange={(e) => setFormData({...formData, to: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <div className="input-wrapper">
            <Calendar size={20} className="input-icon" />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>
        
        <button type="submit" className="search-btn">
          <Search size={20} /> Search
        </button>
      </div>

      <div className="date-shortcuts">
        <button 
          type="button" 
          className="date-shortcut"
          onClick={() => setDateShortcut(0)}
        >
          Today {getTodayDate()}
        </button>
        <button 
          type="button" 
          className="date-shortcut"
          onClick={() => setDateShortcut(1)}
        >
          Tomorrow {getTomorrowDate()}
        </button>
      </div>
    </form>
  )
}

export default SearchForm
