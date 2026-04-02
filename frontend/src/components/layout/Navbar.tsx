import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogIn } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
              Book Tickets
            </Link>
            <a href="#features" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
              Features
            </a>
            <a href="#contact" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" leftIcon={<User className="w-4 h-4" />}>
                Login
              </Button>
            </Link>
            <Link to="/agent/login">
              <Button variant="primary" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                Agent Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-neutral-700" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 animate-slide-down">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/login" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Tickets
              </Link>
              <a 
                href="#features" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#contact" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" fullWidth leftIcon={<User className="w-4 h-4" />}>
                    Login
                  </Button>
                </Link>
                <Link to="/agent/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth leftIcon={<LogIn className="w-4 h-4" />}>
                    Agent Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
