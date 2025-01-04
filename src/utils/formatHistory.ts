import { BaseMessage } from '@langchain/core/messages';

/**
 * Formats an array of chat messages into a single string
 * 
 * This function takes an array of BaseMessage objects and converts them into a 
 * formatted string where each message is on a new line in the format:
 * "[message_type]: [message_content]"
 * 
 * @param history - Array of BaseMessage objects representing the chat history
 * @returns Formatted string containing all messages
 */
const formatChatHistoryAsString = (history: BaseMessage[]) => {
  return history
    .map((message) => `${message._getType()}: ${message.content}`)
    .join('\n');
};

export default formatChatHistoryAsString;
