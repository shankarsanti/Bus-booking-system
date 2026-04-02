import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  interactive = false,
  onClick,
  style
}: CardProps) => {
  return (
    <div
      className={`
        card
        ${hover ? 'card-hover' : ''}
        ${interactive ? 'card-interactive' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }: CardHeaderProps) => (
  <h3 className={`text-xl font-bold text-neutral-900 ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }: CardHeaderProps) => (
  <p className={`text-sm text-neutral-600 mt-1 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }: CardHeaderProps) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }: CardHeaderProps) => (
  <div className={`mt-4 pt-4 border-t border-neutral-200 ${className}`}>{children}</div>
);
