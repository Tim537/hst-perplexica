import { SectionProps } from '../types';
import { Input } from '../settingComponents/Input';

/**
 * API Keys settings section component
 * Allows users to configure various API keys for different services
 *
 * @component
 * @example
 * ```tsx
 * <KeysSection config={config} onConfigChange={handleConfigChange} />
 * ```
 */
export const KeysSection = ({ config, onConfigChange }: SectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <p className="text-black/70 dark:text-white/70 text-sm">
            OpenAI API Key
          </p>
          <Input
            type="text"
            placeholder="OpenAI API Key"
            value={config.openaiApiKey}
            onChange={(e) =>
              onConfigChange({
                ...config,
                openaiApiKey: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-black/70 dark:text-white/70 text-sm">
            Ollama API URL
          </p>
          <Input
            type="text"
            placeholder="Ollama API URL"
            value={config.ollamaApiUrl}
            onChange={(e) =>
              onConfigChange({
                ...config,
                ollamaApiUrl: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-black/70 dark:text-white/70 text-sm">
            GROQ API Key
          </p>
          <Input
            type="text"
            placeholder="GROQ API Key"
            value={config.groqApiKey}
            onChange={(e) =>
              onConfigChange({
                ...config,
                groqApiKey: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-black/70 dark:text-white/70 text-sm">
            Anthropic API Key
          </p>
          <Input
            type="text"
            placeholder="Anthropic API key"
            value={config.anthropicApiKey}
            onChange={(e) =>
              onConfigChange({
                ...config,
                anthropicApiKey: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-black/70 dark:text-white/70 text-sm">
            Gemini API Key
          </p>
          <Input
            type="text"
            placeholder="Gemini API key"
            value={config.geminiApiKey}
            onChange={(e) =>
              onConfigChange({
                ...config,
                geminiApiKey: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
