/**
 * Available sections in the settings dialog
 */
export type SettingsSection = 'theme' | 'providers' | 'keys';

/**
 * Props for the main Settings dialog component
 */
export interface SettingsDialogProps {
  /** Whether the dialog is currently open */
  isOpen: boolean;
  /** Callback to change the dialog's open state */
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Configuration type for the settings
 */
export interface SettingsType {
  /** Available chat model providers and their models */
  chatModelProviders: {
    [key: string]: Array<{
      name: string;
      displayName: string;
      [key: string]: any;
    }>;
  };
  /** Available embedding model providers and their models */
  embeddingModelProviders: {
    [key: string]: Array<{
      name: string;
      displayName: string;
      [key: string]: any;
    }>;
  };
  /** OpenAI API key */
  openaiApiKey: string;
  /** GROQ API key */
  groqApiKey: string;
  /** Anthropic API key */
  anthropicApiKey: string;
  /** Gemini API key */
  geminiApiKey: string;
  /** Ollama API URL */
  ollamaApiUrl: string;
}

/**
 * Props for the settings navigation component
 */
export interface SettingsNavigationProps {
  /** Currently active section */
  activeSection: SettingsSection;
  /** Callback when a different section is selected */
  onSectionChange: (section: SettingsSection) => void;
}

/**
 * Props for the base input component
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Props shared between all section components
 */
export interface SectionProps {
  /** Current settings configuration */
  config: SettingsType;
  /** Callback to update the settings configuration */
  onConfigChange: (config: SettingsType) => void;
  /** Whether the settings are currently being loaded */
  isLoading?: boolean;
} 