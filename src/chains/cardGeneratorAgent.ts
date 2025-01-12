import { RunnableSequence, RunnableMap } from '@langchain/core/runnables';
import ListLineOutputParser from '../lib/outputParsers/listLineOutputParser';
import { PromptTemplate } from '@langchain/core/prompts';
import formatChatHistoryAsString from '../utils/formatHistory';
import { BaseMessage } from '@langchain/core/messages';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';

const cardGeneratorPrompt = `
You are an AI flashcard generator for an AI powered search engine. You will be given a conversation below. You need to generate 3-10 flashcards based on the conversation. The flashcards should be relevant to the conversation and can be used to learn the contents from the chat.
You need to make sure the cards are relevant to the conversation and are helpful to the user.
Make sure the cards are not too long and are informative and relevant to the conversation.

Provide these cards separated by newlines between the XML tags <card> and </card>. Also differentiate between the front <front> and </front>and back <back> and </back> of the card with a newline. For example:

<card>
<front>
What is the capital of France?
</front>
<back>
Paris
</back>
</card>

Conversation:
{chat_history}
`;

type CardGeneratorInput = {
  chat_history: BaseMessage[];
};

const outputParser = new ListLineOutputParser({
  key: 'card',
});

const createSuggestionGeneratorChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    RunnableMap.from({
      chat_history: (input: CardGeneratorInput) =>
        formatChatHistoryAsString(input.chat_history),
    }),
    PromptTemplate.fromTemplate(cardGeneratorPrompt),
    llm,
    outputParser,
  ]);
};

const generateCards = (input: CardGeneratorInput, llm: BaseChatModel) => {
  (llm as unknown as ChatOpenAI).temperature = 0;
  const suggestionGeneratorChain = createSuggestionGeneratorChain(llm);
  return suggestionGeneratorChain.invoke(input);
};

export default generateCards;
