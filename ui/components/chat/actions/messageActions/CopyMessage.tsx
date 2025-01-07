import { Check, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { Message } from '../../types';

interface CopyMessageProps {
  /** The message object containing content and sources */
  message: Message;
  /** The initial message content */
  initialMessage: string;
}

/**
 * CopyMessage Component
 *
 * A button component that copies the message content and its citations to the clipboard.
 * Shows a checkmark icon briefly after copying.
 *
 * @component
 * @example
 * ```tsx
 * <CopyMessage message={messageObj} initialMessage="Original content" />
 * ```
 */
const CopyMessage = ({ message, initialMessage }: CopyMessageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const contentToCopy = `${initialMessage}${
      message.sources && message.sources.length > 0
        ? `\n\nCitations:\n${message.sources
            .map((source, i) => `[${i + 1}] ${source.metadata.url}`)
            .join('\n')}`
        : ''
    }`;

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-black/70 dark:text-white/70 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary hst:hover:bg-[#fcfcf9] hst:hover:text-hst-accent transition duration-200 hover:text-black dark:hover:text-white"
      aria-label={copied ? 'Copied to clipboard' : 'Copy message'}
    >
      {copied ? <Check size={18} /> : <ClipboardList size={18} />}
    </button>
  );
};

export default CopyMessage;
