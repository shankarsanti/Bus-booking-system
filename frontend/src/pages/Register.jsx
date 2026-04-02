import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useData } from '../context/DataContext'
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react'
import './Auth.css'

const Register = () => {
  const navigate = useNavigate()
  const { users, setUsers } = useData()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: 'Not specified',
      totalBookings: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    
    // Add to users list
    setUsers([...users, newUser])
    
    // Save current user session
    localStorage.setItem('user', JSON.stringify({ 
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    }))
    
    alert('Registration successful!')
    navigate('/')
  }

  return (
    <div>
      <Header />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Create Account</h1>
            <p className="auth-subtitle">Sign up to get started</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={20} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={20} />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>I agree to the <Link to="/terms-conditions">Terms & Conditions</Link></span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary auth-btn">
                Create Account
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Register
