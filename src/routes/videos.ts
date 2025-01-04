import express from 'express';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { getAvailableChatModelProviders } from '../lib/providers';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import logger from '../utils/logger';
import handleVideoSearch from '../chains/videoSearchAgent';
import { ChatOpenAI } from '@langchain/openai';

const router = express.Router();

interface ChatModel {
  provider: string;
  model: string;
  customOpenAIBaseURL?: string;
  customOpenAIKey?: string;
}

interface VideoSearchBody {
  query: string;
  chatHistory: any[];
  chatModel?: ChatModel;
}

// POST endpoint for video search
router.post('/', async (req, res) => {
  try {
    let body: VideoSearchBody = req.body;
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

    // Initialize the chat model
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
    } else if (
      chatModelProviders[chatModelProvider] &&
      chatModelProviders[chatModelProvider][chatModel]
    ) {
      // Initialize the chat model from the selected provider
      llm = chatModelProviders[chatModelProvider][chatModel]
        .model as unknown as BaseChatModel | undefined;
    }

    // Check if the selected model is valid
    if (!llm) {
      return res.status(400).json({ message: 'Invalid model selected' });
    }

    // Perform video search using the selected chat model
    const videos = await handleVideoSearch(
      { chat_history: chatHistory, query: body.query },
      llm,
    );

    res.status(200).json({ videos });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in video search: ${err.message}`);
  }
});

export default router;
