import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowButtonProps {
  text: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: string;
}

export function FlowButton({ 
  text, 
  icon, 
  href, 
  onClick,
  bgColor = '#111111',
  textColor = '#111111'
}: FlowButtonProps) {
  const content = (
    <>
      {/* Left arrow - slides in on hover */}
      <ArrowRight 
        className="absolute w-4 h-4 left-[-25%] z-[9] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 group-hover:stroke-white" 
        style={{ stroke: bgColor }}
      />

      {/* Icon (optional) */}
      {icon && (
        <span className="absolute left-4 z-[2] opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          {icon}
        </span>
      )}

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 group-hover:text-white transition-all duration-[800ms] ease-out">
        {text}
      </span>

      {/* Expanding circle */}
      <span 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-[50%] opacity-0 group-hover:w-[400px] group-hover:h-[400px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{ backgroundColor: bgColor }}
      />

      {/* Right arrow - slides out on hover */}
      <ArrowRight 
        className="absolute w-4 h-4 right-4 z-[9] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] group-hover:stroke-white"
        style={{ stroke: bgColor }}
      />
    </>
  );

  const baseClasses = cn(
    "group relative flex items-center gap-1 overflow-hidden rounded-[100px]",
    "border-[1.5px] bg-transparent px-8 py-4 w-full",
    "text-sm font-semibold cursor-pointer transition-all duration-[600ms]",
    "ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent",
    "hover:rounded-[12px] active:scale-[0.95] justify-center"
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        style={{ 
          color: textColor,
          borderColor: `${bgColor}60`
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClasses}
      style={{ 
        color: textColor,
        borderColor: `${bgColor}60`
      }}
    >
      {content}
    </button>
  );
}
