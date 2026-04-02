import Header from '../components/Header'
import Footer from '../components/Footer'
import './LegalPages.css'

const TermsConditions = () => {
  return (
    <div>
      <Header />
      <div className="legal-page">
        <div className="legal-hero">
          <div className="container">
            <h1>Terms & Conditions</h1>
            <p>Last updated: November 18, 2025</p>
          </div>
        </div>

        <div className="container">
          <div className="legal-content">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Akxay Travels booking services, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2>2. Booking and Reservations</h2>
              <p>
                All bookings are subject to availability and confirmation. We reserve the right to refuse or cancel 
                any booking at our discretion.
              </p>
              <ul>
                <li>Bookings must be made at least 30 minutes before departure</li>
                <li>Passengers must arrive at the boarding point 15 minutes before departure</li>
                <li>Valid ID proof must be carried during travel</li>
                <li>Seat numbers are subject to change based on operational requirements</li>
              </ul>
            </section>

            <section>
              <h2>3. Payment Terms</h2>
              <p>
                Payment must be made in full at the time of booking. We accept various payment methods including 
                credit cards, debit cards, net banking, and digital wallets.
              </p>
              <ul>
                <li>All prices are in Indian Rupees (INR)</li>
                <li>Payment gateway charges may apply</li>
                <li>Refunds will be processed as per our cancellation policy</li>
              </ul>
            </section>

            <section>
              <h2>4. Cancellation and Refund Policy</h2>
              <p>Cancellation charges are as follows:</p>
              <ul>
                <li>More than 24 hours before departure: 10% cancellation charge</li>
                <li>12-24 hours before departure: 25% cancellation charge</li>
                <li>6-12 hours before departure: 50% cancellation charge</li>
                <li>Less than 6 hours before departure: No refund</li>
              </ul>
              <p>Refunds will be processed within 7-10 business days.</p>
            </section>

            <section>
              <h2>5. Passenger Responsibilities</h2>
              <ul>
                <li>Passengers must carry valid identification documents</li>
                <li>Smoking and consumption of alcohol are strictly prohibited</li>
                <li>Passengers are responsible for their personal belongings</li>
                <li>Passengers must follow crew instructions at all times</li>
                <li>Unruly behavior may result in removal from the bus without refund</li>
              </ul>
            </section>

            <section>
              <h2>6. Luggage Policy</h2>
              <ul>
                <li>Each passenger is allowed one check-in bag (up to 20kg) and one hand bag</li>
                <li>Excess luggage may be charged separately</li>
                <li>Fragile and valuable items should be carried as hand luggage</li>
                <li>We are not responsible for loss or damage to luggage</li>
              </ul>
            </section>

            <section>
              <h2>7. Service Modifications</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of our services at any time. 
                We will make reasonable efforts to notify passengers of significant changes.
              </p>
            </section>

            <section>
              <h2>8. Limitation of Liability</h2>
              <p>
                Akxay Travels shall not be liable for any indirect, incidental, special, or consequential damages 
                arising out of or in connection with our services. Our liability is limited to the ticket price paid.
              </p>
            </section>

            <section>
              <h2>9. Force Majeure</h2>
              <p>
                We shall not be liable for any failure to perform our obligations due to circumstances beyond our 
                reasonable control, including natural disasters, strikes, or government actions.
              </p>
            </section>

            <section>
              <h2>10. Contact Information</h2>
              <p>
                For any questions regarding these terms and conditions, please contact us at:
              </p>
              <p>
                Email: legal@akxaytravels.com<br />
                Phone: +91 9035123514
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TermsConditions
