import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import './Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('user', JSON.stringify({ email: formData.email }))
    alert('Login successful!')
    navigate('/')
  }

  return (
    <div>
      <Header />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Login to your account</p>

            <form onSubmit={handleSubmit}>
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
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
              </div>

              <button type="submit" className="btn btn-primary auth-btn">
                Login
              </button>
            </form>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login
