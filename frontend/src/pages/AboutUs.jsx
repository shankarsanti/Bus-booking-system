import Header from '../components/Header'
import Footer from '../components/Footer'
import { Bus, Users, Award, Globe, MapPin, Headphones, Shield, Wifi, Gift, Navigation } from 'lucide-react'
import './AboutUs.css'

const AboutUs = () => {
  return (
    <div>
      <Header />
      <div className="about-page">
        <div className="about-hero">
          <div className="container">
            <h1>About Akshay Travels</h1>
            <p>Redefining Bus Travel with Comfort & Luxury</p>
          </div>
        </div>

        <div className="container">
          <section className="about-intro">
            <h2>Who We Are</h2>
            <p>
              Akshay Travels is a renowned brand in the bus operating industry. Our vision is to give a new face to the bus industry. 
              Since our inception, passenger comfort has been our top priority. We have frequently added luxury buses to our huge fleet of buses.
            </p>
            <p>
              The only thing we focus on is that the comfort quotient of our passengers should never be compromised. We have always tried 
              our best to push our limits in order to develop our travel experience. Read further to understand what we offer that enhances 
              our reputation in the market.
            </p>
          </section>

          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">
                <Bus size={40} />
              </div>
              <h3>2000+</h3>
              <p>Buses in Fleet</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Globe size={40} />
              </div>
              <h3>500+</h3>
              <p>Destinations</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Users size={40} />
              </div>
              <h3>10M+</h3>
              <p>Happy Customers</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Award size={40} />
              </div>
              <h3>45+</h3>
              <p>Years of Service</p>
            </div>
          </section>

          <section className="luxury-fleet">
            <h2>Our Luxury Fleet</h2>
            <p className="fleet-intro">
              We take pride in our world-class fleet of luxury buses that redefine comfort and style in bus travel.
            </p>
            <div className="fleet-grid">
              <div className="fleet-card">
                <h3>Mercedes Benz Multi-Axle</h3>
                <p>Experience German engineering excellence with our Mercedes Benz buses featuring superior suspension and comfort.</p>
              </div>
              <div className="fleet-card">
                <h3>Volvo Multi-Axle</h3>
                <p>Travel in Swedish luxury with our Volvo buses known for their safety features and smooth ride quality.</p>
              </div>
              <div className="fleet-card">
                <h3>Scania Multi-Axle</h3>
                <p>Enjoy premium comfort with our Scania buses designed for long-distance travel with maximum passenger comfort.</p>
              </div>
            </div>
          </section>

          <section className="mission-vision">
            <div className="mission">
              <h2>Our Mission</h2>
              <p>
                To give a new face to the bus industry by providing unparalleled comfort, safety, and service. We aim to 
                change the perception of bus travel by continuously pushing our limits and enhancing the travel experience 
                for every passenger.
              </p>
            </div>

            <div className="vision">
              <h2>Our Vision</h2>
              <p>
                To be recognized as the most trusted and innovative bus service provider in India, setting new standards 
                in passenger comfort, safety, and customer satisfaction. We envision a future where bus travel is synonymous 
                with luxury and reliability.
              </p>
            </div>
          </section>

          <section className="services-section">
            <h2>What Makes Us Special</h2>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <Navigation size={32} />
                </div>
                <h3>Live Bus Tracking</h3>
                <p>
                  We have integrated this great technology of live bus tracking in almost all of our buses. This helps the 
                  passengers to be informed about the live position of the bus, thus helping them in planning their commute 
                  to the bus stand. It also prevents the unwanted stress of missing or waiting for the bus in case of delays.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <Headphones size={32} />
                </div>
                <h3>Our Customer Support</h3>
                <p>
                  To render the best service we strive to provide the best customer support. We have an attentive customer 
                  support team to which the passengers can report any issues regarding the journey. This team addresses all 
                  the issues of the passengers and comes out with a solution in the shortest possible time. This creates a 
                  warm feeling in the customers thus pushing them to be our regular customers.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <Bus size={32} />
                </div>
                <h3>Great Comfort</h3>
                <p>
                  Once a passenger boards the bus, they will be surprised by the inner comfort. The buses have all the latest 
                  amenities like WiFi, charging point, water bottle and central TV. The seats are really very comfortable and 
                  create a feeling of a cosy bedroom. Our luxurious fleet includes Mercedes Benz Multi-axle buses, Volvo 
                  Multi-axle buses, and Scania Multi-axle comfort buses. Our motto to change the perception of bus travel 
                  makes us enhance our luxury levels regularly.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <Shield size={32} />
                </div>
                <h3>Safety</h3>
                <p>
                  Safety is one of the most important criteria we look for while planning a bus route. We have the best 
                  drivers who completely understand the importance of safety and follow all the safety rules. Your safety 
                  is our responsibility, and we never compromise on it.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <Gift size={32} />
                </div>
                <h3>Regular Offers</h3>
                <p>
                  We at Akshay Travels strive to maintain the most reasonable rates in the market. This also makes our 
                  passengers happy and thus we further give them discount offers on a regular basis to enhance their happiness. 
                  Check our website regularly for exciting deals and offers.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <Wifi size={32} />
                </div>
                <h3>Modern Amenities</h3>
                <p>
                  All our buses are equipped with modern amenities including free WiFi, mobile charging points, comfortable 
                  reclining seats, air conditioning, entertainment systems, and complimentary water bottles. We ensure your 
                  journey is as comfortable as possible.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUs
