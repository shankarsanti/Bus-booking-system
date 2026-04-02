import { Star, Quote } from 'lucide-react';
import Card from './Card';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  className?: string;
}

const Testimonial = ({ 
  name, 
  role, 
  content, 
  rating, 
  avatar,
  className = '' 
}: TestimonialProps) => {
  return (
    <Card hover className={`relative ${className}`}>
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-200" />
      
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-neutral-300'
            }`}
          />
        ))}
      </div>

      <p className="text-neutral-700 mb-6 leading-relaxed">
        "{content}"
      </p>

      <div className="flex items-center gap-3">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center
          ${avatar ? '' : 'bg-gradient-to-br from-primary-400 to-primary-600'}
          text-white font-bold text-lg
        `}>
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            name.charAt(0)
          )}
        </div>
        <div>
          <div className="font-semibold text-neutral-900">{name}</div>
          <div className="text-sm text-neutral-600">{role}</div>
        </div>
      </div>
    </Card>
  );
};

export default Testimonial;
