import Header from '../components/Header'
import Footer from '../components/Footer'
import './LegalPages.css'

const PrivacyPolicy = () => {
  return (
    <div>
      <Header />
      <div className="legal-page">
        <div className="legal-hero">
          <div className="container">
            <h1>Privacy Policy</h1>
            <p>Last updated: November 18, 2025</p>
          </div>
        </div>

        <div className="container">
          <div className="legal-content">
            <section>
              <h2>1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li>Personal identification information (name, email, phone number)</li>
                <li>Payment information (processed securely through payment gateways)</li>
                <li>Travel preferences and booking history</li>
                <li>Communication records with our customer service</li>
              </ul>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Process your bookings and provide travel services</li>
                <li>Send booking confirmations and travel updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our services and user experience</li>
                <li>Send promotional offers (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2>3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with:
              </p>
              <ul>
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for transaction processing</li>
                <li>Law enforcement when required by law</li>
                <li>Business partners with your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2>5. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2>7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in 
                this privacy policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2>8. Children's Privacy</h2>
              <p>
                Our services are not directed to children under 13. We do not knowingly collect personal information 
                from children under 13.
              </p>
            </section>

            <section>
              <h2>9. Changes to Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <p>
                Email: privacy@akxaytravels.com<br />
                Phone: +91 9035123514<br />
                Address: Akxay Travels Head Office, Bangalore, Karnataka
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
