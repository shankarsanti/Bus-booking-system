import { ReactNode, useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const Tabs = ({ 
  tabs, 
  defaultTab, 
  onChange,
  variant = 'default',
  className = '' 
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const variantStyles = {
    default: {
      container: 'border-b border-neutral-200',
      tab: 'px-4 py-3 font-medium text-sm transition-colors',
      active: 'border-b-2 border-primary-500 text-primary-600',
      inactive: 'text-neutral-600 hover:text-neutral-900 hover:border-neutral-300',
    },
    pills: {
      container: 'bg-neutral-100 p-1 rounded-xl',
      tab: 'px-4 py-2 font-medium text-sm rounded-lg transition-all',
      active: 'bg-white text-primary-600 shadow-sm',
      inactive: 'text-neutral-600 hover:text-neutral-900',
    },
    underline: {
      container: 'space-x-8',
      tab: 'pb-3 font-medium text-sm transition-colors relative',
      active: 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-500',
      inactive: 'text-neutral-600 hover:text-neutral-900',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={`flex ${styles.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              ${styles.tab}
              ${activeTab === tab.id ? styles.active : styles.inactive}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              flex items-center gap-2
            `}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6 animate-fade-in">
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;
