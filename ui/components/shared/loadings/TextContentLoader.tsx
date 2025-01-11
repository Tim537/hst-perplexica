import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TextContentLoaderProps {
  // Anzahl der Zeilen
  lines?: number;
  // Breiten der einzelnen Zeilen (z.B. ['100%', '75%', '85%'])
  lineWidths?: string[];
  // Ob der Loader die volle Breite einnehmen soll
  fullWidth?: boolean;
  // Zusätzliche Styling-Klassen
  className?: string;
}

const TextContentLoader = ({
  lines = 3,
  lineWidths = ['100%', '75%', '85%'],
  fullWidth = false,
  className = '',
}: TextContentLoaderProps) => {
  return (
    <div
      className={`flex flex-col space-y-4 bg-light-primary dark:bg-dark-primary rounded-lg py-3 ${
        fullWidth ? 'w-full' : 'w-full lg:w-9/12'
      } ${className}`}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden"
          style={{ width: lineWidths[i % lineWidths.length] }}
        >
          <div className="h-2 rounded-full bg-light-secondary dark:bg-dark-secondary" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 hst:via-hst-accent/20 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default TextContentLoader;
