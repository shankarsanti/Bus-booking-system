interface DividerProps {
  text?: string;
  className?: string;
}

const Divider = ({ text, className = '' }: DividerProps) => {
  if (text) {
    return (
      <div className={`relative flex items-center my-6 ${className}`}>
        <div className="flex-grow border-t border-neutral-200"></div>
        <span className="flex-shrink mx-4 text-sm text-neutral-500 font-medium">{text}</span>
        <div className="flex-grow border-t border-neutral-200"></div>
      </div>
    );
  }

  return <div className={`divider ${className}`} />;
};

export default Divider;
