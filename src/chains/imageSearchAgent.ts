/**
 * Image Search Agent Module
 *
 * This module provides functionality to search for images using multiple search engines
 * through the SearxNG metasearch engine API. It processes user queries in the context
 * of a conversation and returns relevant image results.
 */

import {
  RunnableSequence,
  RunnableMap,
  RunnableLambda,
} from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import formatChatHistoryAsString from '../utils/formatHistory';
import { BaseMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { searchSearxng } from '../lib/searxng';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

/**
 * Prompt template for rephrasing user queries into standalone image search queries.
 * Includes examples to demonstrate the expected transformation of queries.
 */
const imageSearchChainPrompt = `
You will be given a conversation below and a follow up question. You need to rephrase the follow-up question so it is a standalone question that can be used by the LLM to search the web for images.
You need to make sure the rephrased question agrees with the conversation and is relevant to the conversation. Important: Please strictly follow the instructions below.
Only return the rephrased question, no other text.

Example:
1. Follow up question: What is a cat?
Rephrased: A cat

2. Follow up question: What is a car? How does it works?
Rephrased: Car working

3. Follow up question: How does an AC work?
Rephrased: AC working

Conversation:
{chat_history}

Instructions to strictly follow:
{memories}

Follow up question: {query}
Rephrased question:
`;

/**
 * Type definition for the input required by the image search chain
 */
type ImageSearchChainInput = {
  chat_history: BaseMessage[]; // Array of previous chat messages
  query: string; // Current user query
  memories: string; // Memories
};

// Parser to convert LLM output to string
const strParser = new StringOutputParser();

/**
 * Creates a chain for processing image search requests
 * @param llm - The language model to use for query processing
 * @returns A runnable sequence that processes and executes image searches
 */
const createImageSearchChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    // Map input data to required format
    RunnableMap.from({
      chat_history: (input: ImageSearchChainInput) => {
        return formatChatHistoryAsString(input.chat_history);
      },
      query: (input: ImageSearchChainInput) => {
        return input.query;
      },
      memories: (input: ImageSearchChainInput) => {
        return input.memories;
      },
    }),
    PromptTemplate.fromTemplate(imageSearchChainPrompt),
    llm,
    strParser,
    // Transform search results into structured image data
    RunnableLambda.from(async (input: string) => {
      const res = await searchSearxng(input, {
        engines: ['bing images', 'google images'],
      });

      const images = [];

      // Filter and format valid image results
      res.results.forEach((result) => {
        if (result.img_src && result.url && result.title) {
          images.push({
            img_src: result.img_src,
            url: result.url,
            title: result.title,
          });
        }
      });

      // Return top 10 image results
      return images.slice(0, 10);
    }),
  ]);
};

/**
 * Main handler function for processing image search requests
 * @param input - Object containing chat history and user query
 * @param llm - Language model instance for processing
 * @returns Promise resolving to array of image results
 */
const handleImageSearch = (
  input: ImageSearchChainInput,
  llm: BaseChatModel,
) => {
  const imageSearchChain = createImageSearchChain(llm);
  return imageSearchChain.invoke(input);
};

export default handleImageSearch;
