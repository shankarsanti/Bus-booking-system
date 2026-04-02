import { Link } from 'react-router-dom'
import { Bus, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <Bus size={32} />
                <span>AKXAY TRAVELS</span>
              </div>
              <p className="footer-desc">
                Your trusted travel partner since 1976. Providing safe, comfortable, and reliable bus services 
                across India.
              </p>
              <div className="social-links">
                <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
              </div>
            </div>

            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/my-bookings">My Bookings</Link></li>
                <li><Link to="/track-bus">Track Bus</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Services</h3>
              <ul>
                <li><Link to="/">Bus Booking</Link></li>
                <li><Link to="/">Parcel Services</Link></li>
                <li><Link to="/">Charter Services</Link></li>
                <li><Link to="/">Corporate Booking</Link></li>
                <li><Link to="/admin">Admin Panel</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Contact Info</h3>
              <ul className="contact-list">
                <li>
                  <Phone size={16} />
                  <span>+91 9035123514</span>
                </li>
                <li>
                  <Mail size={16} />
                  <span>support@akxaytravels.com</span>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>Bangalore, Karnataka, India</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Akxay Travels. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-conditions">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
