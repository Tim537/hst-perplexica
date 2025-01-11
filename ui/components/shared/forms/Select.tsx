import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  options: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  menuWidth?: number;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  customTrigger?: React.ReactNode;
  customOption?: (option: SelectOption<T>) => React.ReactNode;
  className?: string;
}

const SelectComponent = <T extends string = string>(
  props: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const {
    className,
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    label,
    helperText,
    error,
    menuWidth,
    disabled,
    onOpen,
    onClose,
    customTrigger,
    customOption,
    ...rest
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<T | undefined>(
    value ?? defaultValue,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;
    setSelectedValue(option.value);
    onChange?.(option.value);
    setIsOpen(false);
    onClose?.();
  };

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    }
  };

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className="flex flex-col gap-1.5" {...rest}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <div ref={ref} className="relative">
        {customTrigger ? (
          <div onClick={handleOpen}>{customTrigger}</div>
        ) : (
          <button
            type="button"
            onClick={handleOpen}
            className={cn(
              'flex w-full items-center justify-between rounded-md border px-3 py-1 focus:outline-none bg-light-secondary dark:bg-[#111111] border-[#d0d0d0] dark:border-[#1c1c1c] hst:rounded-none',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-red-500',
              className,
            )}
          >
            <span className="truncate">
              {selectedOption
                ? selectedOption.label
                : placeholder || 'Select...'}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 opacity-50" />
            </motion.div>
          </button>
        )}

        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              style={{ width: menuWidth }}
              className={cn('absolute z-50 mt-1', !menuWidth && 'w-full')}
            >
              <div className="bg-light-secondary dark:bg-[#111111] rounded-md border border-[#d0d0d0] dark:border-[#1c1c1c] shadow-lg hst:rounded-none">
                {options.map((option) => (
                  <motion.div
                    key={String(option.value)}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      'px-3 py-2 cursor-pointer hover:bg-[#d0d0d0] rounded-[3px] hst:hover:rounded-none dark:hover:bg-[#1c1c1c]',
                      option.disabled && 'opacity-50 cursor-not-allowed',
                      option.value === selectedValue &&
                        'bg-accent/20 dark:bg-accent/30',
                    )}
                  >
                    {customOption ? customOption(option) : option.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(helperText || error) && (
        <p
          className={cn(
            'text-sm',
            error ? 'text-red-500' : 'text-muted-foreground',
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

SelectComponent.displayName = 'Select';

export const Select = React.forwardRef(SelectComponent) as <
  T extends string = string,
>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => JSX.Element;
