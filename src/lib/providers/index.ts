/**
 * Import model loaders for various AI providers
 * Each provider has functions to load their chat and/or embedding models
 */
import { loadGroqChatModels } from './groq';
import { loadOllamaChatModels, loadOllamaEmbeddingsModels } from './ollama';
import { loadOpenAIChatModels, loadOpenAIEmbeddingsModels } from './openai';
import { loadAnthropicChatModels } from './anthropic';
import { loadTransformersEmbeddingsModels } from './transformers';
import { loadGeminiChatModels, loadGeminiEmbeddingsModels } from './gemini';

/**
 * Map of chat model providers to their respective loader functions
 */
const chatModelProviders = {
  openai: loadOpenAIChatModels,
  groq: loadGroqChatModels,
  ollama: loadOllamaChatModels,
  anthropic: loadAnthropicChatModels,
  gemini: loadGeminiChatModels,
};

/**
 * Map of embedding model providers to their respective loader functions
 */
const embeddingModelProviders = {
  openai: loadOpenAIEmbeddingsModels,
  local: loadTransformersEmbeddingsModels, // Local transformer-based embeddings
  ollama: loadOllamaEmbeddingsModels,
  gemini: loadGeminiEmbeddingsModels,
};

/**
 * Gets all available chat model providers and their models
 * Attempts to load models from each provider and only includes those that successfully load
 * @returns Object mapping provider names to their available chat models
 */
export const getAvailableChatModelProviders = async () => {
  const models = {};

  // Try loading models from each provider
  for (const provider in chatModelProviders) {
    const providerModels = await chatModelProviders[provider]();
    if (Object.keys(providerModels).length > 0) {
      models[provider] = providerModels;
    }
  }

  // Add empty custom OpenAI provider for user-configured endpoints
  models['custom_openai'] = {};

  return models;
};

/**
 * Gets all available embedding model providers and their models
 * Attempts to load models from each provider and only includes those that successfully load
 * @returns Object mapping provider names to their available embedding models
 */
export const getAvailableEmbeddingModelProviders = async () => {
  const models = {};

  // Try loading models from each provider
  for (const provider in embeddingModelProviders) {
    const providerModels = await embeddingModelProviders[provider]();
    if (Object.keys(providerModels).length > 0) {
      models[provider] = providerModels;
    }
  }

  return models;
};
