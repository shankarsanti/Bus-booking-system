import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import './ContactUs.css'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for contacting us! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div>
      <Header />
      <div className="contact-page">
        <div className="contact-hero">
          <div className="container">
            <h1>Contact Us</h1>
            <p>We're here to help you 24/7</p>
          </div>
        </div>

        <div className="container">
          <div className="contact-content">
            <div className="contact-info-section">
              <h2>Get In Touch</h2>
              <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

              <div className="contact-cards">
                <div className="contact-card">
                  <div className="contact-icon">
                    <Phone size={28} />
                  </div>
                  <h3>Call Us</h3>
                  <p>+91 9035123514</p>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <Mail size={28} />
                  </div>
                  <h3>Email Us</h3>
                  <p>support@akxaytravels.com</p>
                  <p>info@akxaytravels.com</p>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <MapPin size={28} />
                  </div>
                  <h3>Visit Us</h3>
                  <p>Akxay Travels Head Office</p>
                  <p>Bangalore, Karnataka</p>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <Clock size={28} />
                  </div>
                  <h3>Working Hours</h3>
                  <p>24/7 Customer Support</p>
                  <p>Always Available</p>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <div className="form-card">
                <h2>Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      rows="5"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Send size={20} /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactUs
