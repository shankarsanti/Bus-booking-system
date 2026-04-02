import { useNavigate } from 'react-router-dom';
import { Shield, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import ShaderShowcase from '@/components/ui/hero';

export default function NewHomePage() {
  const navigate = useNavigate();

  const roles = [
    {
      title: 'Admin',
      description: 'Manage buses, routes, and system operations',
      icon: Shield,
      path: '/admin/login',
      gradient: 'from-red-500 to-red-600',
      hoverGradient: 'hover:from-red-400 hover:to-red-500',
    },
    {
      title: 'Agent',
      description: 'Book tickets and manage customer bookings',
      icon: Briefcase,
      path: '/agent/login',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-400 hover:to-blue-500',
    },
    {
      title: 'Customer',
      description: 'Search and book your bus tickets',
      icon: Users,
      path: '/login',
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'hover:from-green-400 hover:to-green-500',
    },
  ];

  return (
    <div 
      className="relative min-h-screen"
      style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(30, 41, 59, 0.80)), url(/bus-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Shader Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <ShaderShowcase />
      </div>

      {/* Role Selection Overlay */}
      <div className="relative z-40 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Welcome to Bus Booking System
            </h1>
            <p className="text-xl text-white/80 font-light">
              Select your role to continue
            </p>
          </motion.div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => navigate(role.path)}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-3xl h-full">
                  {/* Icon */}
                  <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${role.gradient} ${role.hoverGradient} text-white mb-6 shadow-lg transition-all duration-300`}>
                    <role.icon className="w-12 h-12" />
                  </div>

                  {/* Content */}
                  <h2 className="text-3xl font-bold text-white mb-3">
                    {role.title}
                  </h2>
                  <p className="text-white/70 text-lg leading-relaxed mb-6">
                    {role.description}
                  </p>

                  {/* Button */}
                  <motion.button
                    className={`w-full py-4 rounded-full bg-gradient-to-r ${role.gradient} text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login as {role.title}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Instructions */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
              <p className="text-white/90 text-sm">
                <span className="font-semibold">New user?</span> Contact your administrator to create an account
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
