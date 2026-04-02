import { ReactNode, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

const Dropdown = ({ trigger, items, align = 'left', className = '' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 min-w-[200px] bg-white rounded-xl shadow-hard border border-neutral-200
            animate-scale-in origin-top
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          <div className="py-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`
                  w-full px-4 py-2.5 text-left text-sm font-medium
                  flex items-center gap-3 transition-colors
                  ${item.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : item.danger
                      ? 'text-danger-600 hover:bg-danger-50'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }
                  ${index !== items.length - 1 ? 'border-b border-neutral-100' : ''}
                `}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

// Preset Dropdown Button
interface DropdownButtonProps {
  label: string;
  items: DropdownItem[];
  align?: 'left' | 'right';
  variant?: 'primary' | 'secondary';
}

export const DropdownButton = ({ 
  label, 
  items, 
  align = 'left',
  variant = 'secondary' 
}: DropdownButtonProps) => {
  const buttonClass = variant === 'primary' 
    ? 'btn btn-primary' 
    : 'btn btn-secondary';

  return (
    <Dropdown
      trigger={
        <button className={`${buttonClass} flex items-center gap-2`}>
          {label}
          <ChevronDown className="w-4 h-4" />
        </button>
      }
      items={items}
      align={align}
    />
  );
};
