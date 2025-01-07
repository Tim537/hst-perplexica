import { ArrowLeftRight } from 'lucide-react';
import { MessageActionProps } from '../../types';

/**
 * RewriteMessage Component
 *
 * A button component that triggers a message rewrite action.
 * Shows an icon and "Rewrite" text.
 *
 * @component
 * @example
 * ```tsx
 * <RewriteMessage
 *   messageId="123"
 *   onAction={() => handleRewrite("123")}
 * />
 * ```
 */
const RewriteMessage = ({ messageId, onAction }: MessageActionProps) => {
  return (
    <button
      onClick={() => onAction()}
      className="py-2 px-3 text-black/70 dark:text-white/70 rounded-xl hst:hover:bg-[#fcfcf9] hst:hover:text-hst-accent dark:hover:bg-dark-secondary transition duration-200 hover:text-black dark:hover:text-white flex flex-row items-center space-x-1"
      aria-label="Rewrite message"
    >
      <ArrowLeftRight size={18} />
      <p className="text-xs font-medium">Rewrite</p>
    </button>
  );
};

export default RewriteMessage;
