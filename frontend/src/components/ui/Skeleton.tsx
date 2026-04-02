interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  count = 1
}: SkeletonProps) => {
  const baseClass = 'animate-pulse bg-neutral-200';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseClass} ${variantClasses[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;

// Preset Skeleton Components
export const SkeletonCard = () => (
  <div className="card space-y-4">
    <Skeleton variant="rectangular" height={200} />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="40%" />
  </div>
);

export const SkeletonBusCard = () => (
  <div className="card space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="60%" />
      </div>
      <Skeleton variant="rectangular" width={100} height={40} />
    </div>
    <div className="flex gap-4">
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="30%" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    <Skeleton variant="rectangular" height={48} />
    {Array.from({ length: rows }).map((_, index) => (
      <Skeleton key={index} variant="rectangular" height={64} />
    ))}
  </div>
);
