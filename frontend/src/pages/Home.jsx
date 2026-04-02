import Header from '../components/Header'
import Footer from '../components/Footer'
import SearchForm from '../components/SearchForm'
import { Clock, CreditCard, Headphones, Zap, Package, Navigation, Users, Wind, Shield, Star, ArrowRight, MapPin, Calendar, Mail, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import './Home.css'

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Parallax effect for hero section
  useEffect(() => {
    const handleParallax = () => {
      const scrolled = window.pageYOffset
      const parallax = document.querySelector('.hero')
      if (parallax) {
        const speed = scrolled * 0.5
        parallax.style.transform = `translateY(${speed}px)`
      }
    }

    window.addEventListener('scroll', handleParallax)
    return () => window.removeEventListener('scroll', handleParallax)
  }, [])
  return (
    <div className="home">
      <Header />
      
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">🚌 Ride Super. Save Super.</div>
              <h1 className="hero-title">
                <span className="highlight">🔥 Super Rides Start Here</span>
                <span className="highlight">With Super Offers🔥</span>
                <span className="company">from Akshay Travels!</span>
              </h1>
              <div className="hero-offers">
                <div className="offer-main">
                  <span className="offer-percent">20%</span>
                  <span className="offer-text">off on your first booking!</span>
                </div>
                <div className="offer-sub">
                  <span className="offer-percent-small">15%</span>
                  <span className="offer-text-small">off on all bookings</span>
                </div>
              </div>
              <p className="disclaimer">*Discount automatically applied at checkout</p>
              <div className="hero-cta">
                <button className="cta-primary">
                  Book Now <ArrowRight size={20} />
                </button>
                <button className="cta-secondary">
                  View Routes
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="https://image.pollinations.ai/prompt/luxury-yellow-golden-volvo-bus-on-highway-at-sunset-orange-sky-modern-sleek-design-side-view-professional-photography-cinematic-lighting-ultra-realistic?width=900&height=600&nologo=true" 
                alt="Akshay Travels Luxury Bus"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="search-section">
        <div className="container">
          <SearchForm />
        </div>
      </section>
      
      <section className="why-choose">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Akshay Travels?</h2>
            <p className="section-subtitle">Making your bus journey better</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={30} />
              </div>
              <h3>Quick Booking</h3>
              <p>Book your tickets in just a few clicks with our easy-to-use platform</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <CreditCard size={30} />
              </div>
              <h3>Easy Payment</h3>
              <p>Multiple secure payment options available for your convenience</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Headphones size={30} />
              </div>
              <h3>24/7 Support</h3>
              <p>Our dedicated support team is here to help you anytime, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      <section className="explore-india">
        <div className="container">
          <div className="explore-content">
            <div className="explore-text">
              <h2>Explore India with Akshay Travels</h2>
              <p>
                Discover the beauty of India with our extensive network of routes connecting major cities 
                and towns across the country. From bustling metros to serene hill stations, we take you 
                everywhere you want to go.
              </p>
              <p>
                With our modern fleet of luxury buses, experienced drivers, and commitment to punctuality, 
                your journey becomes as memorable as your destination. Travel in comfort, arrive on time, 
                and create unforgettable memories.
              </p>
              <div className="explore-stats">
                <div className="stat-item">
                  <h3>500+</h3>
                  <p>Destinations</p>
                </div>
                <div className="stat-item">
                  <h3>2000+</h3>
                  <p>Daily Trips</p>
                </div>
                <div className="stat-item">
                  <h3>10M+</h3>
                  <p>Happy Travelers</p>
                </div>
              </div>
            </div>
            <div className="explore-image">
              <img 
                src="https://image.pollinations.ai/prompt/india-map-with-bus-routes-connecting-cities-modern-illustration-travel-network?width=600&height=500&nologo=true" 
                alt="Explore India"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="amenities-section">
        <div className="container">
          <div className="amenities-header">
            <h2>Making your bus journey better</h2>
            <p>Check out all our bus amenities</p>
          </div>
          <div className="amenities-grid">
            <div className="amenity-card">
              <div className="amenity-icon">
                <Zap size={32} color="#fbc02d" />
              </div>
              <h3>Charging Points</h3>
            </div>

            <div className="amenity-card">
              <div className="amenity-icon">
                <Package size={32} color="#fbc02d" />
              </div>
              <h3>Luggage Safety</h3>
            </div>

            <div className="amenity-card">
              <div className="amenity-icon">
                <Navigation size={32} color="#fbc02d" />
              </div>
              <h3>Live Bus Tracking</h3>
            </div>

            <div className="amenity-card">
              <div className="amenity-icon">
                <Users size={32} color="#fbc02d" />
              </div>
              <h3>Back Up Drivers</h3>
            </div>

            <div className="amenity-card">
              <div className="amenity-icon">
                <Wind size={32} color="#fbc02d" />
              </div>
              <h3>Blankets In AC Buses</h3>
            </div>

            <div className="amenity-card">
              <div className="amenity-icon">
                <Shield size={32} color="#fbc02d" />
              </div>
              <h3>Fire Extinguishers</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="popular-routes">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Routes</h2>
            <p className="section-subtitle">Most traveled destinations with great offers</p>
          </div>
          <div className="routes-grid">
            <div className="route-card">
              <div className="route-header">
                <MapPin size={20} className="route-icon" />
                <h4>Mumbai → Pune</h4>
              </div>
              <div className="route-details">
                <div className="route-info">
                  <Calendar size={16} />
                  <span>Daily departures</span>
                </div>
                <div className="route-info">
                  <Clock size={16} />
                  <span>3.5 hours</span>
                </div>
              </div>
              <div className="route-price">Starting from ₹450</div>
              <button className="route-book-btn">Book Now</button>
            </div>

            <div className="route-card">
              <div className="route-header">
                <MapPin size={20} className="route-icon" />
                <h4>Delhi → Agra</h4>
              </div>
              <div className="route-details">
                <div className="route-info">
                  <Calendar size={16} />
                  <span>Multiple daily</span>
                </div>
                <div className="route-info">
                  <Clock size={16} />
                  <span>4 hours</span>
                </div>
              </div>
              <div className="route-price">Starting from ₹380</div>
              <button className="route-book-btn">Book Now</button>
            </div>

            <div className="route-card">
              <div className="route-header">
                <MapPin size={20} className="route-icon" />
                <h4>Bangalore → Chennai</h4>
              </div>
              <div className="route-details">
                <div className="route-info">
                  <Calendar size={16} />
                  <span>6 daily trips</span>
                </div>
                <div className="route-info">
                  <Clock size={16} />
                  <span>6 hours</span>
                </div>
              </div>
              <div className="route-price">Starting from ₹650</div>
              <button className="route-book-btn">Book Now</button>
            </div>

            <div className="route-card">
              <div className="route-header">
                <MapPin size={20} className="route-icon" />
                <h4>Hyderabad → Vijayawada</h4>
              </div>
              <div className="route-details">
                <div className="route-info">
                  <Calendar size={16} />
                  <span>Every 2 hours</span>
                </div>
                <div className="route-info">
                  <Clock size={16} />
                  <span>4.5 hours</span>
                </div>
              </div>
              <div className="route-price">Starting from ₹520</div>
              <button className="route-book-btn">Book Now</button>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Travelers Say</h2>
            <p className="section-subtitle">Real experiences from real customers</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbc02d" color="#fbc02d" />
                ))}
              </div>
              <p>"Excellent service! The bus was clean, comfortable, and arrived on time. The staff was very helpful throughout the journey."</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://image.pollinations.ai/prompt/professional-indian-woman-smiling-portrait-business-casual?width=60&height=60&nologo=true" alt="Priya Sharma" />
                </div>
                <div className="author-info">
                  <h4>Priya Sharma</h4>
                  <span>Mumbai → Pune</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbc02d" color="#fbc02d" />
                ))}
              </div>
              <p>"Amazing experience! The booking process was smooth, and the bus had all the amenities as promised. Highly recommended!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://image.pollinations.ai/prompt/professional-indian-man-smiling-portrait-business-casual?width=60&height=60&nologo=true" alt="Rajesh Kumar" />
                </div>
                <div className="author-info">
                  <h4>Rajesh Kumar</h4>
                  <span>Delhi → Jaipur</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbc02d" color="#fbc02d" />
                ))}
                <Star size={16} color="#fbc02d" />
              </div>
              <p>"Great value for money. The seats were comfortable and the journey was pleasant. Will definitely book again for future travels."</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://image.pollinations.ai/prompt/professional-indian-woman-smiling-portrait-casual?width=60&height=60&nologo=true" alt="Anita Patel" />
                </div>
                <div className="author-info">
                  <h4>Anita Patel</h4>
                  <span>Bangalore → Mysore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Stay Updated with Latest Offers</h2>
              <p>Subscribe to our newsletter and never miss out on exclusive deals and travel updates</p>
            </div>
            <div className="newsletter-form">
              <div className="input-group">
                <Mail size={20} className="input-icon" />
                <input type="email" placeholder="Enter your email address" />
                <button className="subscribe-btn">Subscribe</button>
              </div>
              <p className="newsletter-disclaimer">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </section>
      
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <ChevronUp size={24} />
        </button>
      )}
      
      <Footer />
    </div>
  )
}

export default Home
