import { WebSocket } from 'ws';
import { handleMessage } from './messageHandler';
import {
  getAvailableEmbeddingModelProviders,
  getAvailableChatModelProviders,
} from '../lib/providers';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { Embeddings } from '@langchain/core/embeddings';
import type { IncomingMessage } from 'http';
import logger from '../utils/logger';
import { ChatOpenAI } from '@langchain/openai';

/**
 * Handles new WebSocket connections and manages the lifecycle of the connection
 * @param ws - WebSocket instance
 * @param request - HTTP request that initiated the WebSocket connection
 */
export const handleConnection = async (
  ws: WebSocket,
  request: IncomingMessage,
) => {
  try {
    // Extract query parameters from the request URL
    const searchParams = new URL(request.url, `http://${request.headers.host}`)
      .searchParams;

    // Load available chat and embedding model providers concurrently
    const [chatModelProviders, embeddingModelProviders] = await Promise.all([
      getAvailableChatModelProviders(),
      getAvailableEmbeddingModelProviders(),
    ]);

    // Determine which chat model and provider to use, falling back to the first available if not specified
    const chatModelProvider =
      searchParams.get('chatModelProvider') ||
      Object.keys(chatModelProviders)[0];
    const chatModel =
      searchParams.get('chatModel') ||
      Object.keys(chatModelProviders[chatModelProvider])[0];

    // Determine which embedding model and provider to use, falling back to the first available if not specified
    const embeddingModelProvider =
      searchParams.get('embeddingModelProvider') ||
      Object.keys(embeddingModelProviders)[0];
    const embeddingModel =
      searchParams.get('embeddingModel') ||
      Object.keys(embeddingModelProviders[embeddingModelProvider])[0];

    let llm: BaseChatModel | undefined;
    let embeddings: Embeddings | undefined;

    // Initialize the chat model based on provider type
    if (
      chatModelProviders[chatModelProvider] &&
      chatModelProviders[chatModelProvider][chatModel] &&
      chatModelProvider != 'custom_openai'
    ) {
      // Use standard provider configuration
      llm = chatModelProviders[chatModelProvider][chatModel]
        .model as unknown as BaseChatModel | undefined;
    } 
    // Initialize custom OpenAI configuration with provided parameters
    else if (chatModelProvider == 'custom_openai') {
      llm = new ChatOpenAI({
        modelName: chatModel,
        openAIApiKey: searchParams.get('openAIApiKey'),
        temperature: 0.7,
        configuration: {
          baseURL: searchParams.get('openAIBaseURL'),
        },
      }) as unknown as BaseChatModel;
    }

    // Initialize the embedding model if available
    if (
      embeddingModelProviders[embeddingModelProvider] &&
      embeddingModelProviders[embeddingModelProvider][embeddingModel]
    ) {
      embeddings = embeddingModelProviders[embeddingModelProvider][
        embeddingModel
      ].model as Embeddings | undefined;
    }

    // Validate that both models were initialized successfully
    if (!llm || !embeddings) {
      ws.send(
        JSON.stringify({
          type: 'error',
          data: 'Invalid LLM or embeddings model selected, please refresh the page and try again.',
          key: 'INVALID_MODEL_SELECTED',
        }),
      );
      ws.close();
    }

    // Send a confirmation signal once the connection is ready
    const interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'signal',
            data: 'open',
          }),
        );
        clearInterval(interval);
      }
    }, 5);

    // Set up message handler for incoming WebSocket messages
    ws.on(
      'message',
      async (message) =>
        await handleMessage(message.toString(), ws, llm, embeddings),
    );

    // Log when the connection is closed
    ws.on('close', () => logger.debug('Connection closed'));
  } catch (err) {
    // Handle any errors that occur during connection setup
    ws.send(
      JSON.stringify({
        type: 'error',
        data: 'Internal server error.',
        key: 'INTERNAL_SERVER_ERROR',
      }),
    );
    ws.close();
    logger.error(err);
  }
};
