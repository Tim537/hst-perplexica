import express from 'express';
import handleImageSearch from '../chains/imageSearchAgent';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { getAvailableChatModelProviders } from '../lib/providers';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import logger from '../utils/logger';
import { ChatOpenAI } from '@langchain/openai';
import db from '../db/index';
import { memories } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

interface ChatModel {
  provider: string;
  model: string;
  customOpenAIBaseURL?: string;
  customOpenAIKey?: string;
}

interface ImageSearchBody {
  query: string;
  chatHistory: any[];
  chatModel?: ChatModel;
}

// POST endpoint for image search
router.post('/', async (req, res) => {
  try {
    let body: ImageSearchBody = req.body;

    // Convert chat history array to LangChain message format
    const chatHistory = body.chatHistory.map((msg: any) => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      } else if (msg.role === 'assistant') {
        return new AIMessage(msg.content);
      }
    });

    // Get available chat model providers and select default if not specified
    const chatModelProviders = await getAvailableChatModelProviders();

    const chatModelProvider =
      body.chatModel?.provider || Object.keys(chatModelProviders)[0];
    const chatModel =
      body.chatModel?.model ||
      Object.keys(chatModelProviders[chatModelProvider])[0];

    let llm: BaseChatModel | undefined;

    // Check if the chat model is custom OpenAI
    if (body.chatModel?.provider === 'custom_openai') {
      // Check if custom OpenAI base URL and key are provided
      if (
        !body.chatModel?.customOpenAIBaseURL ||
        !body.chatModel?.customOpenAIKey
      ) {
        return res
          .status(400)
          .json({ message: 'Missing custom OpenAI base URL or key' });
      }

      // Initialize a custom OpenAI chat model
      llm = new ChatOpenAI({
        modelName: body.chatModel.model,
        openAIApiKey: body.chatModel.customOpenAIKey,
        temperature: 0.7,
        configuration: {
          baseURL: body.chatModel.customOpenAIBaseURL,
        },
      }) as unknown as BaseChatModel;
    }

    // If the chat model is not custom OpenAI, use the default provider
    else if (
      chatModelProviders[chatModelProvider] &&
      chatModelProviders[chatModelProvider][chatModel]
    ) {
      llm = chatModelProviders[chatModelProvider][chatModel]
        .model as unknown as BaseChatModel | undefined;
    }

    if (!llm) {
      return res.status(400).json({ message: 'Invalid model selected' });
    }

    const memoryRecords = await db.query.memories.findMany({
      where: eq(memories.type, 'image'),
    });

    const memoryContents = memoryRecords
      .map((record, index) => `${index + 1}. ${record.content}`)
      .join('\n');

    // Perform image search using the selected chat model
    const images = await handleImageSearch(
      {
        query: body.query,
        chat_history: chatHistory,
        memories: memoryContents,
      },
      llm,
    );

    // Return the images as a JSON response
    res.status(200).json({ images });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in image search: ${err.message}`);
  }
});

export default router;
