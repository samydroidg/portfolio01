interface SkeletonSectionProps {
  className?: string;
  lines?: number;
}

export default function SkeletonSection({ className = '', lines = 3 }: SkeletonSectionProps) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="h-6 w-32 bg-accent-soft/50 rounded" />
      <div className="h-3 w-64 bg-accent-soft/30 rounded" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 w-full bg-accent-soft/20 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  );
}
