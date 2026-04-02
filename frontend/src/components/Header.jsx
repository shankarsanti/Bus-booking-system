import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bus, User, Phone, Mail, Menu, X } from 'lucide-react'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={14} />
                <span>+91 9035123514</span>
              </div>
              <div className="contact-item">
                <Mail size={14} />
                <span>support@akxaytravels.com</span>
              </div>
            </div>
            <div className="contact-info">
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo" onClick={closeMenu}>
              <Bus size={36} />
              <div className="logo-text">
                <span>AKXAY TRAVELS</span>
                <span className="logo-subtitle">BOOK YOUR JOURNEY</span>
              </div>
            </Link>
            
            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <Link to="/" onClick={closeMenu}>Home</Link>
              <Link to="/track-bus" onClick={closeMenu}>Track Bus</Link>
              <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
              <Link to="/about" onClick={closeMenu}>About</Link>
              <div className="nav-actions-mobile">
                <Link to="/admin" className="admin-link" onClick={closeMenu}>Admin Panel</Link>
                <Link to="/login" className="login-btn" onClick={closeMenu}>
                  <User size={16} />
                  Login
                </Link>
              </div>
            </nav>
            
            <div className="header-actions">
              <Link to="/admin" className="admin-link">Admin Panel</Link>
              <Link to="/login" className="login-btn">
                <User size={16} />
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </header>
  )
}

export default Header
