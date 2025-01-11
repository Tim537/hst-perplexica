import { type ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  spacing?: string; // z.B. '0.5rem', '1rem', etc.
}

const Tooltip = ({ text, children, spacing = '0.5rem' }: TooltipProps) => {
  return (
    <div className="group relative">
      {children}
      <div
        className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ bottom: `calc(100% + ${spacing})` }}
      >
        <div className="bg-light-secondary dark:bg-dark-secondary hst:bg-hst-secondary border border-[#cccccc] dark:border-dark-200 hst:border-hst-border rounded-md hst:rounded-none px-2 pb-0.5 relative">
          <span className="text-[0.625rem] text-black/70 dark:text-white/70 hst:text-hst-text whitespace-nowrap leading-none">
            {text}
          </span>
          <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-light-secondary dark:bg-dark-secondary hst:bg-hst-secondary border-b border-r border-[#cccccc] dark:border-dark-200 hst:border-hst-border transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
