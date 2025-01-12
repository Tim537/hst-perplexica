import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  label?: string;
  hideWhenUnchecked?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Checkbox({
  checked,
  onChange,
  className,
  label,
  hideWhenUnchecked = false,
  onClick,
}: CheckboxProps) {
  return (
    <label
      className={cn('flex items-center cursor-pointer relative', className)}
    >
      <input
        type="checkbox"
        className={cn(
          'peer h-4 w-4 cursor-pointer transition-all appearance-none rounded  border border-slate-300 checked:bg-[#24a0ed] hst:checked:bg-hst-accent checked:border-[#24a0ed] hst:checked:border-hst-accent hst:rounded-none',
          hideWhenUnchecked &&
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        )}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onClick={onClick}
        aria-label={label}
      />
      <span className="absolute text-light-primary opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </label>
  );
}
