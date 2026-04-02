import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

const StatCard = ({ 
  icon: Icon, 
  value, 
  label, 
  trend,
  color = 'blue',
  className = '' 
}: StatCardProps) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className={`
      bg-white rounded-2xl p-6 shadow-soft border border-neutral-100
      hover:shadow-medium transition-all duration-300
      ${className}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className={`
          p-3 rounded-xl bg-gradient-to-br ${colors[color]}
          shadow-lg
        `}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`
            text-sm font-semibold px-2 py-1 rounded-full
            ${trend.isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
            }
          `}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </div>
        )}
      </div>
      
      <div className="text-3xl font-bold text-neutral-900 mb-1">
        {value}
      </div>
      
      <div className="text-sm text-neutral-600 font-medium">
        {label}
      </div>
    </div>
  );
};

export default StatCard;
