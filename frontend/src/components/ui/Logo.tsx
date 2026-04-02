import { Bus } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'white';
  className?: string;
}

const Logo = ({ 
  size = 'md', 
  showText = true, 
  variant = 'default',
  className = '' 
}: LogoProps) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-2xl' },
    lg: { icon: 'w-12 h-12', text: 'text-4xl' },
  };

  const colors = {
    default: {
      gradient: 'from-primary-500 to-primary-700',
      text: 'text-neutral-900',
      accent: 'text-primary-600',
    },
    white: {
      gradient: 'from-white to-primary-50',
      text: 'text-white',
      accent: 'text-white',
    },
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`
        ${sizes[size].icon} 
        rounded-xl bg-gradient-to-br ${colors[variant].gradient}
        flex items-center justify-center shadow-lg
        transform transition-transform hover:scale-110
      `}>
        <Bus className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7'} ${variant === 'white' ? 'text-primary-600' : 'text-white'}`} />
      </div>
      {showText && (
        <div className={`font-display font-bold ${sizes[size].text} ${colors[variant].text}`}>
          SHANKAR'S <span className={colors[variant].accent}>BUS TRAVEL</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
