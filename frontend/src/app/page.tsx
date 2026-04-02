import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Shield, Clock, CreditCard, MapPin, Users, Star, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner, PageTransition, Card, Logo, TrustBadge, Testimonial } from '../components/ui';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && profile) {
      switch (profile.role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'agent':
          navigate('/agent/dashboard', { replace: true });
          break;
        case 'customer':
          navigate('/customer/dashboard', { replace: true });
          break;
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-neutral-600 font-medium">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white"
          style={{
            backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(30, 58, 138, 0.85)), url(/bus-background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-soft"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative container-custom py-20 md:py-28">
            {/* Logo */}
            <div className="flex justify-center mb-8 animate-slide-up">
              <Logo size="lg" variant="white" />
            </div>

            <div className="text-center max-w-4xl mx-auto mb-12 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">India's #1 Bus Travel Platform</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
                Book Your Journey
                <span className="block text-primary-100">With Confidence</span>
              </h1>
              
              <p className="text-lg md:text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
                Experience seamless bus booking with real-time availability, secure payments, and instant confirmation
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <TrustBadge type="secure" />
                <TrustBadge type="verified" />
                <TrustBadge type="trusted" />
                <TrustBadge type="rated" />
              </div>
            </div>

            {/* Search Form */}
            <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <SearchForm />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link 
                to="/login" 
                className="btn btn-lg bg-white text-primary-600 hover:bg-primary-50 hover:shadow-xl shadow-lg"
              >
                <Users className="w-5 h-5" />
                Login to Book
              </Link>
              <Link 
                to="/agent/login" 
                className="btn btn-lg bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20"
              >
                <Bus className="w-5 h-5" />
                Agent Login
              </Link>
              <Link 
                to="/admin/login" 
                className="btn btn-lg btn-ghost text-white hover:bg-white/10"
              >
                <Shield className="w-5 h-5" />
                Admin Portal
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              {[
                { label: 'Happy Customers', value: '50K+', icon: Users },
                { label: 'Bus Operators', value: '200+', icon: Bus },
                { label: 'Routes Covered', value: '500+', icon: MapPin },
                { label: 'Success Rate', value: '99.9%', icon: TrendingUp },
              ].map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 animate-slide-up hover:bg-white/20 transition-all duration-300"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-primary-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="section bg-gradient-to-b from-neutral-50 to-white">
          <div className="container-custom">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                Why Choose Us?
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                We make bus travel simple, safe, and convenient with our modern platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Bus className="w-12 h-12" />,
                  title: 'Wide Network',
                  description: 'Access to 200+ bus operators covering 500+ routes across India',
                  color: 'from-blue-500 to-blue-600',
                },
                {
                  icon: <CreditCard className="w-12 h-12" />,
                  title: 'Secure Payments',
                  description: 'Multiple payment options with bank-grade security and instant confirmation',
                  color: 'from-green-500 to-green-600',
                },
                {
                  icon: <Clock className="w-12 h-12" />,
                  title: 'Real-Time Updates',
                  description: 'Live bus tracking, seat availability, and instant booking confirmation',
                  color: 'from-purple-500 to-purple-600',
                },
                {
                  icon: <Shield className="w-12 h-12" />,
                  title: 'Safe & Reliable',
                  description: 'Verified operators, secure transactions, and 24/7 customer support',
                  color: 'from-red-500 to-red-600',
                },
                {
                  icon: <MapPin className="w-12 h-12" />,
                  title: 'Easy Booking',
                  description: 'Book tickets in just 3 simple steps with our intuitive interface',
                  color: 'from-yellow-500 to-yellow-600',
                },
                {
                  icon: <Star className="w-12 h-12" />,
                  title: 'Best Prices',
                  description: 'Competitive pricing with exclusive deals and offers for our users',
                  color: 'from-pink-500 to-pink-600',
                },
              ].map((feature, index) => (
                <Card 
                  key={feature.title} 
                  hover 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                Book in 3 Simple Steps
              </h2>
              <p className="text-lg text-neutral-600">
                Your journey is just a few clicks away
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: '01', title: 'Search', description: 'Enter your source, destination, and travel date', icon: MapPin },
                { step: '02', title: 'Select', description: 'Choose your preferred bus and seat', icon: CheckCircle },
                { step: '03', title: 'Book', description: 'Complete payment and get instant confirmation', icon: Zap },
              ].map((item, index) => (
                <div key={item.step} className="relative text-center animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-2xl font-bold mb-4 shadow-lg">
                    {item.step}
                    {index < 2 && (
                      <div className="hidden md:block absolute left-full top-1/2 w-full h-1 bg-gradient-to-r from-primary-300 to-transparent -translate-y-1/2"></div>
                    )}
                  </div>
                  <item.icon className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-neutral-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section bg-gradient-to-b from-neutral-50 to-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-neutral-600">
                Join thousands of satisfied travelers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Testimonial
                name="Priya Sharma"
                role="Frequent Traveler"
                content="SHANKAR'S BUS TRAVEL has made my travel so much easier! The booking process is smooth, and I love the real-time seat selection feature. Highly recommended!"
                rating={5}
              />
              <Testimonial
                name="Rajesh Kumar"
                role="Business Professional"
                content="I travel every week for work, and SHANKAR'S BUS TRAVEL is my go-to platform. The payment is secure, and I always get instant confirmation. Great service!"
                rating={5}
              />
              <Testimonial
                name="Anita Desai"
                role="Student"
                content="As a student, I appreciate the competitive prices and easy booking. The customer support is also very responsive. Thank you SHANKAR'S BUS TRAVEL!"
                rating={5}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-neutral-900">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Join thousands of happy travelers who trust SHANKAR'S BUS TRAVEL for their travel needs
            </p>
            <Link 
              to="/login" 
              className="btn btn-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:shadow-xl shadow-lg"
            >
              <Bus className="w-5 h-5" />
              Start Booking Now
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
