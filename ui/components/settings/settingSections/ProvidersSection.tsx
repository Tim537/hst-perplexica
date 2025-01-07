import { useState } from 'react';
import { SectionProps } from '../types';
import { Input } from '../settingComponents/Input';
import { Select } from '../settingComponents/Select';

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
            <Select
              value={selectedChatModelProvider ?? undefined}
              onChange={(e) => {
                setSelectedChatModelProvider(e.target.value);
                if (e.target.value === 'custom_openai') {
                  setSelectedChatModel('');
                } else {
                  setSelectedChatModel(
                    config.chatModelProviders[e.target.value][0].name,
                  );
                }
                localStorage.setItem('chatModelProvider', e.target.value);
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
          selectedChatModelProvider != 'custom_openai' && (
            <div className="flex flex-col space-y-1">
              <p className="text-black/70 dark:text-white/70 text-sm">
                Chat Model
              </p>
              <Select
                value={selectedChatModel ?? undefined}
                onChange={(e) => {
                  setSelectedChatModel(e.target.value);
                  localStorage.setItem('chatModel', e.target.value);
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
            <Select
              value={selectedEmbeddingModelProvider ?? undefined}
              onChange={(e) => {
                setSelectedEmbeddingModelProvider(e.target.value);
                setSelectedEmbeddingModel(
                  config.embeddingModelProviders[e.target.value][0].name,
                );
                localStorage.setItem('embeddingModelProvider', e.target.value);
              }}
              options={Object.keys(config.embeddingModelProviders).map(
                (provider) => ({
                  label: provider.charAt(0).toUpperCase() + provider.slice(1),
                  value: provider,
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
            <Select
              value={selectedEmbeddingModel ?? undefined}
              onChange={(e) => {
                setSelectedEmbeddingModel(e.target.value);
                localStorage.setItem('embeddingModel', e.target.value);
              }}
              options={(() => {
                const embeddingModelProvider =
                  config.embeddingModelProviders[
                    selectedEmbeddingModelProvider
                  ];

                return embeddingModelProvider
                  ? embeddingModelProvider.length > 0
                    ? embeddingModelProvider.map((model) => ({
                        label: model.displayName,
                        value: model.name,
                      }))
                    : [
                        {
                          label: 'No embedding models available',
                          value: '',
                          disabled: true,
                        },
                      ]
                  : [
                      {
                        label: 'Invalid provider, please check backend logs',
                        value: '',
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
