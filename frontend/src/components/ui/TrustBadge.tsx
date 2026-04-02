import { Shield, Award, Users, Star } from 'lucide-react';

interface TrustBadgeProps {
  type: 'secure' | 'verified' | 'trusted' | 'rated';
  className?: string;
}

const TrustBadge = ({ type, className = '' }: TrustBadgeProps) => {
  const badges = {
    secure: {
      icon: Shield,
      text: 'Secure Payments',
      color: 'from-green-500 to-green-600',
    },
    verified: {
      icon: Award,
      text: 'Verified Operators',
      color: 'from-blue-500 to-blue-600',
    },
    trusted: {
      icon: Users,
      text: '50K+ Happy Users',
      color: 'from-purple-500 to-purple-600',
    },
    rated: {
      icon: Star,
      text: '4.8/5 Rating',
      color: 'from-yellow-500 to-yellow-600',
    },
  };

  const badge = badges[type];
  const Icon = badge.icon;

  return (
    <div className={`
      inline-flex items-center gap-2 px-4 py-2 rounded-full
      bg-white/10 backdrop-blur-sm border border-white/20
      ${className}
    `}>
      <div className={`p-1.5 rounded-full bg-gradient-to-br ${badge.color}`}>
        <Icon className="w-3 h-3 text-white" />
      </div>
      <span className="text-sm font-medium">{badge.text}</span>
    </div>
  );
};

export default TrustBadge;
