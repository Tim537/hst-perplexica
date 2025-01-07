import React from 'react';
import { cn } from '../../../lib/utils';
import { InputProps } from '../types';

/**
 * Base input component with consistent styling
 *
 * @component
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   placeholder="Enter value"
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 * />
 * ```
 */
export const Input = ({ className, ...restProps }: InputProps) => {
  return (
    <input
      {...restProps}
      className={cn(
        'bg-light-secondary dark:bg-dark-secondary px-3 py-2 flex items-center overflow-hidden border border-light-200 dark:border-dark-200 dark:text-white rounded-lg text-sm',
        className,
      )}
    />
  );
};
