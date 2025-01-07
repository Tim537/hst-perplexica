import { Document } from '@langchain/core/documents';
import { ReactNode } from 'react';

/**
 * Represents a file in the chat system
 */
export interface FileType {
  /** Unique identifier for the file */
  fileId: string;
  /** Name of the file */
  fileName: string;
  /** Extension of the file (e.g., 'pdf', 'txt') */
  fileExtension: string;
}

/**
 * Represents a source of information in messages
 */
export interface MessageSource {
  metadata: {
    /** URL where the source can be found */
    url: string;
  };
}

/**
 * Represents a chat message
 */
export interface Message {
  /** Role of the message sender ('user' or 'assistant') */
  role: 'user' | 'assistant';
  /** Content of the message */
  content: string;
  /** Unique identifier for the message */
  messageId: string;
  /** ID of the chat this message belongs to */
  chatId: string;
  /** Timestamp when the message was created */
  createdAt: Date;
  /** Optional sources referenced in the message */
  sources?: Document[];
  /** Optional suggested follow-up messages */
  suggestions?: string[];
}

/**
 * Props for the basic chat input component
 */
export interface ChatInputProps {
  /** Callback function when a message is submitted */
  onSubmit: (message: string) => void;
  /** Whether the input is in a loading state */
  isLoading?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
}

/**
 * Props for chat container components
 */
export interface ChatContainerProps {
  /** Child elements */
  children: ReactNode;
  /** Optional CSS class names */
  className?: string;
}

/**
 * Props for message action components (e.g., copy, rewrite)
 */
export interface MessageActionProps {
  /** ID of the message the action applies to */
  messageId: string;
  /** Callback function when the action is triggered */
  onAction: () => void;
}

/**
 * Props for chat section components
 */
export interface ChatSectionProps {
  /** Optional section title */
  title?: string;
  /** Child elements */
  children: ReactNode;
}

/**
 * Props for file attachment components
 */
export interface FileAttachmentProps {
  /** Array of file IDs */
  fileIds: string[];
  /** Callback to update file IDs */
  setFileIds: (fileIds: string[]) => void;
  /** Whether to show the "Attach" text */
  showText?: boolean;
  /** Array of File objects */
  files: FileType[];
  /** Callback to update files */
  setFiles: (files: FileType[]) => void;
}

/**
 * Props for WebSocket handler components
 */
export interface WebSocketHandlerProps {
  /** WebSocket URL */
  url: string;
  /** Callback to update WebSocket ready state */
  setIsWSReady: (ready: boolean) => void;
  /** Callback to update error state */
  setError: (error: boolean) => void;
}

/** Type representing chat history as array of [role, content] tuples */
export type ChatHistory = [string, string][];

/**
 * WebSocket message structure for incoming messages
 */
export interface WebSocketMessage {
  /** Type of the message */
  type: 'message' | 'sources' | 'messageEnd' | 'error' | 'signal';
  /** Message data */
  data: any;
  /** Optional message ID */
  messageId?: string;
}

/**
 * WebSocket message structure for outgoing messages
 */
export interface WebSocketSendMessage {
  /** Message type (always 'message' for outgoing) */
  type: 'message';
  /** Message details */
  message: {
    messageId: string;
    chatId: string;
    content: string;
  };
  /** Attached file IDs */
  files: string[];
  /** Focus mode setting */
  focusMode: FocusMode;
  /** Optimization mode setting */
  optimizationMode: OptimizationMode;
  /** Current chat history */
  history: ChatHistory;
}

/**
 * Model provider configuration
 */
export interface ModelProviders {
  /** Available chat model providers and their models */
  chatModelProviders: Record<string, Record<string, any>>;
  /** Available embedding model providers and their models */
  embeddingModelProviders: Record<string, Record<string, any>>;
}

// Chat mode types
/** Focus mode options for chat */
export type FocusMode = 'webSearch' | string;
/** Optimization mode options for chat */
export type OptimizationMode = 'speed' | string;
/** Input mode options for message input */
export type InputMode = 'multi' | 'single';

/**
 * Chat file structure from API
 */
export interface ChatFile {
  /** Name of the file */
  name: string;
  /** Unique identifier for the file */
  fileId: string;
}

/**
 * Chat data structure from API
 */
export interface ChatData {
  /** Array of messages with metadata */
  messages: Array<{
    metadata: string;
    [key: string]: any;
  }>;
  /** Chat configuration */
  chat: {
    files: ChatFile[];
    focusMode: FocusMode;
  };
}

/**
 * Context for message handler functions
 */
export interface MessageHandlerContext {
  /** ID of the chat */
  chatId: string;
  /** ID of the message */
  messageId: string;
  /** Optional sources for the message */
  sources?: Document[];
  /** Whether the message has been added */
  added: boolean;
  /** Received message content */
  recievedMessage: string;
  /** Callback to update messages */
  setMessages: (messages: Message[]) => void;
  /** Callback to update loading state */
  setLoading: (loading: boolean) => void;
  /** Callback to update message appeared state */
  setMessageAppeared: (appeared: boolean) => void;
  /** Callback to update chat history */
  setChatHistory: (history: ChatHistory) => void;
  /** WebSocket instance */
  ws: WebSocket | null;
}

/**
 * Props for message input component
 */
export interface MessageInputProps {
  /** Callback to send a message */
  sendMessage: (message: string) => void;
  /** Whether the input is in loading state */
  loading: boolean;
  /** Array of file IDs */
  fileIds: string[];
  /** Callback to update file IDs */
  setFileIds: (fileIds: string[]) => void;
  /** Array of files */
  files: FileType[];
  /** Callback to update files */
  setFiles: (files: FileType[]) => void;
}

/**
 * Props for empty chat input component
 */
export interface EmptyChatInputProps {
  /** Callback to send a message */
  sendMessage: (message: string) => void;
  /** Current focus mode */
  focusMode: FocusMode;
  /** Callback to update focus mode */
  setFocusMode: (mode: FocusMode) => void;
  /** Current optimization mode */
  optimizationMode: OptimizationMode;
  /** Callback to update optimization mode */
  setOptimizationMode: (mode: OptimizationMode) => void;
  /** Array of file IDs */
  fileIds: string[];
  /** Callback to update file IDs */
  setFileIds: (fileIds: string[]) => void;
  /** Array of files */
  files: FileType[];
  /** Callback to update files */
  setFiles: (files: FileType[]) => void;
}

/**
 * Props for message sources component
 */
export interface MessageSourceProps {
  /** Array of document sources */
  sources: Document[];
  /** Whether the sources dialog is open */
  isOpen: boolean;
  /** Callback to update dialog open state */
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Props for copilot toggle component
 */
export interface CopilotToggleProps {
  /** Whether copilot is enabled */
  copilotEnabled: boolean;
  /** Callback to update copilot enabled state */
  setCopilotEnabled: (enabled: boolean) => void;
}

/**
 * Common keyboard event handler type
 */
export interface KeyboardEventHandler {
  /** Event handler for keydown events */
  handleKeyDown: (e: KeyboardEvent) => void;
  /** Whether the input is focused */
  isInputFocused: boolean;
}

/**
 * Focus mode option configuration
 */
export interface FocusModeOption {
  /** Unique key for the mode */
  key: FocusMode;
  /** Display title */
  title: string;
  /** Description of the mode */
  description: string;
  /** Icon component */
  icon: ReactNode;
}

/**
 * Props for the main Chat component
 */
export interface ChatProps {
  /** Array of chat messages */
  messages: Message[];
  /** Callback to send a message */
  sendMessage: (message: string) => void;
  /** Whether the chat is loading */
  loading: boolean;
  /** Whether a message has appeared */
  messageAppeared: boolean;
  /** Callback to rewrite a message */
  rewrite: (messageId: string) => void;
  /** Array of file IDs */
  fileIds: string[];
  /** Callback to update file IDs */
  setFileIds: (fileIds: string[]) => void;
  /** Array of files */
  files: FileType[];
  /** Callback to update files */
  setFiles: (files: FileType[]) => void;
}

/**
 * Props for the ChatWindow component
 */
export interface ChatWindowProps {
  /** Optional chat ID */
  id?: string;
}

/**
 * Props for the EmptyChat component
 */
export interface EmptyChatProps {
  /** Callback to send a message */
  sendMessage: (message: string) => void;
  /** Current focus mode */
  focusMode: FocusMode;
  /** Callback to update focus mode */
  setFocusMode: (mode: FocusMode) => void;
  /** Current optimization mode */
  optimizationMode: OptimizationMode;
  /** Callback to update optimization mode */
  setOptimizationMode: (mode: OptimizationMode) => void;
  /** Array of file IDs */
  fileIds: string[];
  /** Callback to update file IDs */
  setFileIds: (fileIds: string[]) => void;
  /** Array of files */
  files: FileType[];
  /** Callback to update files */
  setFiles: (files: FileType[]) => void;
} 