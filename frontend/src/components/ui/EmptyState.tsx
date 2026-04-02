import { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  className = '' 
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-neutral-400 animate-bounce-soft">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-bold text-neutral-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-neutral-600 max-w-md mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
