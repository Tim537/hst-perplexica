import { useState } from 'react';
import { SectionProps } from '../types';
import { Input } from '../settingComponents/Input';
import { Select } from '@/components/shared/forms/Select';

/**
 * Providers and Models settings section component
 * Allows users to configure model providers and select specific models
 *
 * @component
 * @example
 * ```tsx
 * <ProvidersSection config={config} onConfigChange={handleConfigChange} />
 * ```
 */
export const ProvidersSection = ({ config }: SectionProps) => {
  const [selectedChatModelProvider, setSelectedChatModelProvider] = useState<
    string | null
  >(
    localStorage.getItem('chatModelProvider') ||
      Object.keys(config.chatModelProviders)[0] ||
      null,
  );
  const [selectedChatModel, setSelectedChatModel] = useState<string | null>(
    localStorage.getItem('chatModel') || null,
  );
  const [selectedEmbeddingModelProvider, setSelectedEmbeddingModelProvider] =
    useState<string | null>(
      localStorage.getItem('embeddingModelProvider') ||
        Object.keys(config.embeddingModelProviders)[0] ||
        null,
    );
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState<
    string | null
  >(localStorage.getItem('embeddingModel') || null);
  const [customOpenAIApiKey, setCustomOpenAIApiKey] = useState<string>(
    localStorage.getItem('openAIApiKey') || '',
  );
  const [customOpenAIBaseURL, setCustomOpenAIBaseURL] = useState<string>(
    localStorage.getItem('openAIBaseURL') || '',
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        {config.chatModelProviders && (
          <div className="flex flex-col space-y-1">
            <p className="text-black/70 dark:text-white/70 text-sm">
              Chat Model Provider
            </p>
            <Select<string>
              value={selectedChatModelProvider || undefined}
              onChange={(value) => {
                setSelectedChatModelProvider(value);
                if (value === 'custom_openai') {
                  setSelectedChatModel('');
                } else {
                  setSelectedChatModel(
                    config.chatModelProviders[value][0].name,
                  );
                }
                localStorage.setItem('chatModelProvider', value);
              }}
              options={Object.keys(config.chatModelProviders).map(
                (provider) => ({
                  value: provider,
                  label: provider.charAt(0).toUpperCase() + provider.slice(1),
                }),
              )}
            />
          </div>
        )}

        {/* Chat Model Selection */}
        {selectedChatModelProvider &&
          selectedChatModelProvider !== 'custom_openai' && (
            <div className="flex flex-col space-y-1">
              <p className="text-black/70 dark:text-white/70 text-sm">
                Chat Model
              </p>
              <Select<string>
                value={selectedChatModel || undefined}
                onChange={(value) => {
                  setSelectedChatModel(value);
                  localStorage.setItem('chatModel', value);
                }}
                options={(() => {
                  const chatModelProvider =
                    config.chatModelProviders[selectedChatModelProvider];

                  return chatModelProvider
                    ? chatModelProvider.length > 0
                      ? chatModelProvider.map((model) => ({
                          value: model.name,
                          label: model.displayName,
                        }))
                      : [
                          {
                            value: '',
                            label: 'No models available',
                            disabled: true,
                          },
                        ]
                    : [
                        {
                          value: '',
                          label: 'Invalid provider, please check backend logs',
                          disabled: true,
                        },
                      ];
                })()}
              />
            </div>
          )}

        {/* Custom OpenAI Settings */}
        {selectedChatModelProvider === 'custom_openai' && (
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="text-black/70 dark:text-white/70 text-sm">
                Model Name
              </p>
              <Input
                type="text"
                placeholder="Model name"
                value={selectedChatModel || ''}
                onChange={(e) => {
                  setSelectedChatModel(e.target.value);
                  localStorage.setItem('chatModel', e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-black/70 dark:text-white/70 text-sm">
                Custom OpenAI API Key
              </p>
              <Input
                type="text"
                placeholder="Custom OpenAI API Key"
                value={customOpenAIApiKey}
                onChange={(e) => {
                  setCustomOpenAIApiKey(e.target.value);
                  localStorage.setItem('openAIApiKey', e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-black/70 dark:text-white/70 text-sm">
                Custom OpenAI Base URL
              </p>
              <Input
                type="text"
                placeholder="Custom OpenAI Base URL"
                value={customOpenAIBaseURL}
                onChange={(e) => {
                  setCustomOpenAIBaseURL(e.target.value);
                  localStorage.setItem('openAIBaseURL', e.target.value);
                }}
              />
            </div>
          </div>
        )}

        {/* Embedding Model Provider */}
        {config.embeddingModelProviders && (
          <div className="flex flex-col space-y-1">
            <p className="text-black/70 dark:text-white/70 text-sm">
              Embedding Model Provider
            </p>
            <Select<string>
              value={selectedEmbeddingModelProvider || undefined}
              onChange={(value) => {
                setSelectedEmbeddingModelProvider(value);
                setSelectedEmbeddingModel(
                  config.embeddingModelProviders[value][0].name,
                );
                localStorage.setItem('embeddingModelProvider', value);
              }}
              options={Object.keys(config.embeddingModelProviders).map(
                (provider) => ({
                  value: provider,
                  label: provider.charAt(0).toUpperCase() + provider.slice(1),
                }),
              )}
            />
          </div>
        )}

        {/* Embedding Model Selection */}
        {selectedEmbeddingModelProvider && (
          <div className="flex flex-col space-y-1">
            <p className="text-black/70 dark:text-white/70 text-sm">
              Embedding Model
            </p>
            <Select<string>
              value={selectedEmbeddingModel || undefined}
              onChange={(value) => {
                setSelectedEmbeddingModel(value);
                localStorage.setItem('embeddingModel', value);
              }}
              options={(() => {
                const embeddingModelProvider =
                  config.embeddingModelProviders[
                    selectedEmbeddingModelProvider
                  ];

                return embeddingModelProvider
                  ? embeddingModelProvider.length > 0
                    ? embeddingModelProvider.map((model) => ({
                        value: model.name,
                        label: model.displayName,
                      }))
                    : [
                        {
                          value: '',
                          label: 'No embedding models available',
                          disabled: true,
                        },
                      ]
                  : [
                      {
                        value: '',
                        label: 'Invalid provider, please check backend logs',
                        disabled: true,
                      },
                    ];
              })()}
            />
          </div>
        )}
      </div>
    </div>
  );
};
