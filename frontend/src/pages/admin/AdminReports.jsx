import React, { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Download, Calendar, TrendingUp, DollarSign, Users, Bus, FileText } from 'lucide-react'

const AdminReports = () => {
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-01-31'
  })

  const reports = [
    {
      id: 1,
      title: 'Revenue Report',
      description: 'Detailed revenue breakdown by routes, buses, and time periods',
      icon: DollarSign,
      color: '#43e97b'
    },
    {
      id: 2,
      title: 'Booking Report',
      description: 'Complete booking statistics including cancellations and confirmations',
      icon: FileText,
      color: '#667eea'
    },
    {
      id: 3,
      title: 'User Activity Report',
      description: 'User registration, bookings, and engagement metrics',
      icon: Users,
      color: '#f093fb'
    },
    {
      id: 4,
      title: 'Bus Performance Report',
      description: 'Bus-wise occupancy rates, revenue, and trip statistics',
      icon: Bus,
      color: '#4facfe'
    },
    {
      id: 5,
      title: 'Route Analysis Report',
      description: 'Popular routes, demand patterns, and pricing insights',
      icon: TrendingUp,
      color: '#fa709a'
    },
    {
      id: 6,
      title: 'Financial Summary',
      description: 'Comprehensive financial overview including taxes and commissions',
      icon: DollarSign,
      color: '#30cfd0'
    }
  ]

  const recentReports = [
    { name: 'January 2024 Revenue Report', date: '2024-02-01', size: '2.4 MB', type: 'PDF' },
    { name: 'December 2023 Booking Report', date: '2024-01-01', size: '1.8 MB', type: 'Excel' },
    { name: 'Q4 2023 Financial Summary', date: '2024-01-05', size: '3.2 MB', type: 'PDF' },
    { name: 'User Activity Report - Dec 2023', date: '2024-01-02', size: '1.5 MB', type: 'Excel' }
  ]

  const handleGenerateReport = (reportTitle) => {
    alert(`Generating ${reportTitle} for ${dateRange.from} to ${dateRange.to}`)
  }

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: '30px' }}>Reports & Analytics</h1>

      {/* Date Range Selector */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={24} color="#f9a825" />
          Select Date Range
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '15px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              style={{ padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '15px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => {
              const today = new Date()
              const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
              const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
              setDateRange({
                from: lastMonth.toISOString().split('T')[0],
                to: lastMonthEnd.toISOString().split('T')[0]
              })
            }}>
              Last Month
            </button>
            <button className="btn btn-secondary" onClick={() => {
              const today = new Date()
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
              setDateRange({
                from: firstDay.toISOString().split('T')[0],
                to: today.toISOString().split('T')[0]
              })
            }}>
              This Month
            </button>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <h2 style={{ marginBottom: '20px' }}>Available Reports</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {reports.map(report => (
          <div key={report.id} className="card" style={{ padding: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${report.color} 0%, ${report.color}dd 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <report.icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{report.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                  {report.description}
                </p>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleGenerateReport(report.title)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Download size={18} />
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <h2 style={{ marginBottom: '20px' }}>Recent Reports</h2>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Generated Date</th>
              <th>File Size</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.map((report, index) => (
              <tr key={index}>
                <td><strong>{report.name}</strong></td>
                <td>{report.date}</td>
                <td>{report.size}</td>
                <td>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: report.type === 'PDF' ? '#e3f2fd' : '#f3e5f5',
                    color: report.type === 'PDF' ? '#1976d2' : '#7b1fa2'
                  }}>
                    {report.type}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary btn-small" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Download size={16} />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

export default AdminReports
