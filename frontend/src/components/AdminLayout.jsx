import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Bus, BookOpen, Users, Tag, FileText, Settings, LogOut, ExternalLink, Menu, X, DollarSign } from 'lucide-react'
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      navigate('/admin')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/admin')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/buses', icon: Bus, label: 'Buses' },
    { path: '/admin/seat-pricing', icon: DollarSign, label: 'Seat Pricing' },
    { path: '/admin/bookings', icon: BookOpen, label: 'Bookings' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/offers', icon: Tag, label: 'Offers' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="admin-logo">
          <span>Admin Panel</span>
          <button className="sidebar-close" onClick={closeSidebar} aria-label="Close sidebar">
            <X size={24} />
          </button>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      
      <div className="admin-content">
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
              <Menu size={24} />
            </button>
            <h2>Bus Booking Admin</h2>
          </div>
          <div className="admin-header-actions">
            <button onClick={handleLogout} className="btn btn-secondary">
              <LogOut size={18} /> <span className="btn-text">Logout</span>
            </button>
          </div>
        </header>
        
        <main className="admin-main">
          {children}
        </main>
      </div>
      
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </div>
  )
}

export default AdminLayout
