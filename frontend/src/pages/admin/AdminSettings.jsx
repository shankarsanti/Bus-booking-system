import React, { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Save, Bell, Mail, Shield, Globe, DollarSign, Clock } from 'lucide-react'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Bus Booking System',
    siteEmail: 'admin@busbooking.com',
    supportPhone: '+91 9035123514',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    bookingCancellationHours: 24,
    refundPercentage: 80,
    emailNotifications: true,
    smsNotifications: true,
    bookingConfirmation: true,
    paymentNotifications: true,
    maintenanceMode: false,
    allowGuestBooking: true,
    maxSeatsPerBooking: 6,
    advanceBookingDays: 90
  })

  const handleSave = (e) => {
    e.preventDefault()
    alert('Settings saved successfully!')
  }

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: '30px' }}>System Settings</h1>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gap: '25px' }}>
          {/* General Settings */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={24} color="#f9a825" />
              General Settings
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Site Email</label>
                <input
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Support Phone</label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Booking Settings */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={24} color="#f9a825" />
              Booking Settings
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Cancellation Window (hours)</label>
                <input
                  type="number"
                  value={settings.bookingCancellationHours}
                  onChange={(e) => setSettings({...settings, bookingCancellationHours: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
                <small style={{ color: '#666' }}>Hours before departure to allow cancellation</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Refund Percentage (%)</label>
                <input
                  type="number"
                  value={settings.refundPercentage}
                  onChange={(e) => setSettings({...settings, refundPercentage: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
                <small style={{ color: '#666' }}>Percentage of amount to refund on cancellation</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Max Seats Per Booking</label>
                <input
                  type="number"
                  value={settings.maxSeatsPerBooking}
                  onChange={(e) => setSettings({...settings, maxSeatsPerBooking: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Advance Booking Days</label>
                <input
                  type="number"
                  value={settings.advanceBookingDays}
                  onChange={(e) => setSettings({...settings, advanceBookingDays: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
                <small style={{ color: '#666' }}>Days in advance users can book</small>
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.allowGuestBooking}
                  onChange={(e) => setSettings({...settings, allowGuestBooking: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '500' }}>Allow Guest Booking (without registration)</span>
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={24} color="#f9a825" />
              Notification Settings
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <Mail size={20} />
                <div>
                  <div style={{ fontWeight: '500' }}>Email Notifications</div>
                  <small style={{ color: '#666' }}>Send email notifications to users</small>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <Bell size={20} />
                <div>
                  <div style={{ fontWeight: '500' }}>SMS Notifications</div>
                  <small style={{ color: '#666' }}>Send SMS notifications to users</small>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                <input
                  type="checkbox"
                  checked={settings.bookingConfirmation}
                  onChange={(e) => setSettings({...settings, bookingConfirmation: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: '500' }}>Booking Confirmation Notifications</div>
                  <small style={{ color: '#666' }}>Notify users when booking is confirmed</small>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                <input
                  type="checkbox"
                  checked={settings.paymentNotifications}
                  onChange={(e) => setSettings({...settings, paymentNotifications: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <DollarSign size={20} />
                <div>
                  <div style={{ fontWeight: '500' }}>Payment Notifications</div>
                  <small style={{ color: '#666' }}>Notify users about payment status</small>
                </div>
              </label>
            </div>
          </div>

          {/* System Settings */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={24} color="#f9a825" />
              System Settings
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: settings.maintenanceMode ? '#fff3cd' : '#f8f9fa', borderRadius: '8px' }}>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontWeight: '500' }}>Maintenance Mode</div>
                <small style={{ color: '#666' }}>Enable maintenance mode to prevent user access</small>
              </div>
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px' }}>
            <Save size={20} />
            Save All Settings
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export default AdminSettings
