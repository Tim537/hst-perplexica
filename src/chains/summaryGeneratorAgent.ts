import { RunnableSequence, RunnableMap } from '@langchain/core/runnables';
import ListLineOutputParser from '../lib/outputParsers/listLineOutputParser';
import { PromptTemplate } from '@langchain/core/prompts';
import formatChatHistoryAsString from '../utils/formatHistory';
import { BaseMessage } from '@langchain/core/messages';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';

const SummaryGeneratorPrompt = `
You are an AI summary generator for an AI powered search engine. You will be given a conversation below. You need to generate an accurate summary based on the conversation. The summary should be relevant to the conversation that can be used by the user as foundation to learn the new input from the AI.
You need to make sure the summary is relevant to the conversation and are helpful to the user. Keep a note that the user will use this summary to learn the new input from the AI. 
Make sure to use the language of the conversation it's very important.

Provide the summary between the XML tags <summary> and </summary>. For example:

<summary>
Tesla, an American electric vehicle and clean energy company, is known for its innovative approach to automotive design and renewable energy solutions. Founded by Elon Musk, Tesla has revolutionized the electric vehicle market with its high-performance cars and commitment to sustainability. The company also focuses on energy storage and solar products, aiming to create a sustainable future.
</summary>

Conversation:
{chat_history}

P.S.: Don't switch the language of the conversation in any case.
`;

type SummaryGeneratorInput = {
  chat_history: BaseMessage[];
};

const outputParser = new ListLineOutputParser({
  key: 'summary',
});

const createSummaryGeneratorChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    RunnableMap.from({
      chat_history: (input: SummaryGeneratorInput) =>
        formatChatHistoryAsString(input.chat_history),
    }),
    PromptTemplate.fromTemplate(SummaryGeneratorPrompt),
    llm,
    outputParser,
  ]);
};

const generateSummary = (input: SummaryGeneratorInput, llm: BaseChatModel) => {
  (llm as unknown as ChatOpenAI).temperature = 0;
  const summaryGeneratorChain = createSummaryGeneratorChain(llm);
  return summaryGeneratorChain.invoke(input);
};

export default generateSummary;
