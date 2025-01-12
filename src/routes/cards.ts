import express from 'express';
import logger from '../utils/logger';
import db from '../db/index';
import { stacks, cards } from '../db/schema';
import { eq, inArray, sql } from 'drizzle-orm';
import AnkiExport from 'anki-apkg-export';
import fs from 'fs';
import path from 'path';
import generateCards from '../chains/cardGeneratorAgent';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { getAvailableChatModelProviders } from '../lib/providers';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';

function parseCardsFromArray(arr: string[]): Card[] {
  const cards: Card[] = [];
  let currentCard: Partial<Card> = {};

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item === '<front>') {
      currentCard.front = arr[i + 1];
      i++; // Skip the content
    } else if (item === '<back>') {
      currentCard.back = arr[i + 1];
      i++; // Skip the content
      if (currentCard.front && currentCard.back) {
        cards.push(currentCard as Card);
        currentCard = {};
      }
    }
  }

  return cards;
}

const router = express.Router();

interface Card {
  front: string;
  back: string;
}

interface ChatModel {
  provider: string;
  model: string;
  customOpenAIBaseURL?: string;
  customOpenAIKey?: string;
}

interface SuggestionsBody {
  chatHistory: any[];
  chatModel?: ChatModel;
  chatId: string;
}

/**
 * Creates a new flashcard stack associated with a chat.
 * @route POST /createStack
 * @param {Object} req.body.chatHistory - The chat history to create cards from
 * @param {string|number} req.body.chatId - The ID of the chat to associate the stack with
 * @returns {Object} The newly created stack
 * @throws {400} If required fields are missing or invalid
 * @throws {500} If there's a server error
 */
router.post('/createStack', async (req, res) => {
  try {
    let body: SuggestionsBody = req.body;

    if (!body.chatHistory || !body.chatId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for existing stack to prevent duplicates
    const existingStack = await db
      .select()
      .from(stacks)
      .where(eq(stacks.chat, body.chatId))
      .execute();

    if (existingStack.length > 0) {
      return res
        .status(400)
        .json({ message: 'A stack for this chat already exists.' });
    }

    const chatHistory = body.chatHistory.map((msg: any) => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      } else if (msg.role === 'assistant') {
        return new AIMessage(msg.content);
      }
    });

    const chatModelProviders = await getAvailableChatModelProviders();

    const chatModelProvider =
      body.chatModel?.provider || Object.keys(chatModelProviders)[0];
    const chatModel =
      body.chatModel?.model ||
      Object.keys(chatModelProviders[chatModelProvider])[0];

    let llm: BaseChatModel | undefined;

    if (body.chatModel?.provider === 'custom_openai') {
      if (
        !body.chatModel?.customOpenAIBaseURL ||
        !body.chatModel?.customOpenAIKey
      ) {
        return res
          .status(400)
          .json({ message: 'Missing custom OpenAI base URL or key' });
      }

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
      llm = chatModelProviders[chatModelProvider][chatModel]
        .model as unknown as BaseChatModel | undefined;
    }

    if (!llm) {
      return res.status(400).json({ message: 'Invalid model selected' });
    }

    const generatedCards: any = await generateCards(
      { chat_history: chatHistory },
      llm,
    );

    const parsedCards = parseCardsFromArray(generatedCards);

    const cardIds = [];

    for (const card of parsedCards) {
      const result = await db
        .insert(cards)
        .values({
          front: card.front,
          back: card.back,
          stack: 0,
        })
        .returning()
        .execute();

      cardIds.push(result[0].id);
    }

    // Create the stack with references to the cards
    const result = await db
      .insert(stacks)
      .values({
        chat: body.chatId,
        cards: cardIds,
      })
      .returning()
      .execute();

    const newStack = result[0];

    // Update cards with the correct stack ID
    await db
      .update(cards)
      .set({ stack: newStack.id })
      .where(inArray(cards.id, cardIds))
      .execute();

    const populatedCardIds: number[] = newStack.cards as number[];
    const populatedCardsList = await db
      .select()
      .from(cards)
      .where(inArray(cards.id, populatedCardIds))
      .execute();

    newStack.cards = populatedCardsList;

    return res
      .status(201)
      .json({ message: 'Stack created successfully', stack: newStack });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error creating stack: ${err.message}`);
  }
});

/**
 * Retrieves a stack and its cards by chat ID.
 * @route GET /:chatId/listStacksByChatId
 * @param {string} req.params.chatId - The chat ID to find stacks for
 * @returns {Object} The stack and its associated cards
 * @throws {400} If chatId is invalid
 * @throws {404} If stack is not found
 * @throws {500} If there's a server error
 */
router.get('/:chatId/listStacksByChatId', async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find the stack for the given chat
    const stack = await db
      .select()
      .from(stacks)
      .where(eq(stacks.chat, chatId))
      .execute()
      .then((result) => result[0]);

    if (!stack) {
      return res.status(404).json({ message: 'Stack not found' });
    }

    // Fetch all cards associated with the stack
    const cardIds: number[] = stack.cards as number[];
    const cardsList = await db
      .select()
      .from(cards)
      .where(inArray(cards.id, cardIds))
      .execute();

    stack.cards = cardsList;

    return res.status(200).json(stack);
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error listing stacks: ${err.message}`);
  }
});

/**
 * Lists all flashcard stacks in the system.
 * @route GET /listAllStacks
 * @returns {Array} Array of all stacks
 * @throws {500} If there's a server error
 */
router.get('/listAllStacks', async (req, res) => {
  try {
    const stacksList = await db.select().from(stacks).execute();
    return res.status(200).json(stacksList);
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error listing all stacks: ${err.message}`);
  }
});

/**
 * Deletes a specific card and removes its reference from any stacks.
 * @route DELETE /:cardId/deleteCard
 * @param {string} req.params.cardId - The ID of the card to delete
 * @returns {Object} Success message
 * @throws {400} If cardId is invalid
 * @throws {404} If card is not found
 * @throws {500} If there's a server error
 */
router.delete('/:cardId/deleteCard', async (req, res) => {
  try {
    const { cardId } = req.params;

    const numericCardId = parseInt(cardId, 10);
    if (isNaN(numericCardId)) {
      return res.status(400).json({ message: 'cardId must be a number' });
    }

    // Verify card exists
    const cardExists = await db
      .select()
      .from(cards)
      .where(eq(cards.id, numericCardId))
      .execute()
      .then((result) => result.length > 0);

    if (!cardExists) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Find and update all stacks that contain this card
    const stacksWithCard = await db
      .select()
      .from(stacks)
      .where(
        sql`EXISTS (SELECT 1 FROM json_each(stacks.cards) WHERE json_each.value = ${numericCardId})`,
      )
      .execute();

    // Remove card reference from each stack
    for (const stack of stacksWithCard) {
      const updatedCards = (stack.cards as number[]).filter(
        (id) => id !== numericCardId,
      );
      await db
        .update(stacks)
        .set({ cards: updatedCards })
        .where(eq(stacks.id, stack.id))
        .execute();
    }

    // Delete the card
    await db.delete(cards).where(eq(cards.id, numericCardId)).execute();

    return res.status(200).json({ message: 'Card deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error deleting card: ${err.message}`);
  }
});

/**
 * Deletes a specific stack.
 * @route DELETE /:stackId/deleteStack
 * @param {string} req.params.stackId - The ID of the stack to delete
 * @returns {Object} Success message
 * @throws {400} If stackId is invalid
 * @throws {404} If stack is not found
 * @throws {500} If there's a server error
 */
router.delete('/:stackId/deleteStack', async (req, res) => {
  try {
    const { stackId } = req.params;

    const numericStackId = parseInt(stackId, 10);
    if (isNaN(numericStackId)) {
      return res.status(400).json({ message: 'stackId must be a number' });
    }

    // Verify stack exists
    const stackExists = await db
      .select()
      .from(stacks)
      .where(eq(stacks.id, numericStackId))
      .execute()
      .then((result) => result.length > 0);

    if (!stackExists) {
      return res.status(404).json({ message: 'Stack not found' });
    }

    await db.delete(stacks).where(eq(stacks.id, numericStackId)).execute();

    return res.status(200).json({ message: 'Stack deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error deleting stack: ${err.message}`);
  }
});

/**
 * Updates a specific flashcard's content.
 * @route PUT /:cardId/updateCard
 * @param {string} req.params.cardId - The ID of the card to update
 * @param {string} req.body.front - The new front content of the card
 * @param {string} req.body.back - The new back content of the card
 * @returns {Object} The updated card
 * @throws {400} If cardId is invalid or required fields are missing
 * @throws {404} If card is not found
 * @throws {500} If there's a server error
 */
router.put('/:cardId/updateCard', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { front, back } = req.body;

    const numericCardId = parseInt(cardId, 10);
    if (isNaN(numericCardId)) {
      return res.status(400).json({ message: 'cardId must be a number' });
    }

    if (!front || !back) {
      return res
        .status(400)
        .json({ message: 'Missing required fields: front and back' });
    }

    // Verify card exists
    const cardExists = await db
      .select()
      .from(cards)
      .where(eq(cards.id, numericCardId))
      .execute()
      .then((result) => result.length > 0);

    if (!cardExists) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Update card content
    await db
      .update(cards)
      .set({ front, back })
      .where(eq(cards.id, numericCardId))
      .execute();

    // Fetch and return the updated card
    const updatedCard = await db
      .select()
      .from(cards)
      .where(eq(cards.id, numericCardId))
      .execute()
      .then((result) => result[0]);

    return res
      .status(200)
      .json({ message: 'Card updated successfully', card: updatedCard });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error updating card: ${err.message}`);
  }
});

/**
 * Exports selected cards as an Anki deck file.
 * @route GET /exportCards
 * @param {string} req.query.cardIds - Comma-separated list of card IDs to export
 * @returns {File} The generated Anki deck file (.apkg)
 * @throws {400} If cardIds is missing or invalid
 * @throws {404} If no cards are found
 * @throws {500} If there's a server error
 */
router.get('/exportCards', async (req, res) => {
  try {
    const { cardIds } = req.query;
    if (!cardIds || typeof cardIds !== 'string') {
      return res
        .status(400)
        .json({ message: 'Missing or invalid field: cardIds' });
    }

    // Convert and validate card IDs
    const numericCardIds = cardIds.split(',').map((id) => parseInt(id, 10));
    if (numericCardIds.some(isNaN)) {
      return res.status(400).json({ message: 'All cardIds must be numbers' });
    }

    // Fetch cards to export
    const cardsList = await db
      .select()
      .from(cards)
      .where(inArray(cards.id, numericCardIds))
      .execute();

    if (cardsList.length === 0) {
      return res.status(404).json({ message: 'No cards found' });
    }

    // Create and populate Anki deck
    const apkg = new AnkiExport('Deck Name');
    cardsList.forEach((card) => {
      apkg.addCard(card.front, card.back);
    });

    // Generate and save the deck file
    const zip = await apkg.save();
    const filePath = path.join(__dirname, 'cards.apkg');
    fs.writeFileSync(filePath, zip, 'binary');

    // Send file and clean up
    res.download(filePath, 'cards.apkg', (err) => {
      if (err) {
        logger.error(`Error sending file: ${err.message}`);
      }
      fs.unlinkSync(filePath); // Delete the file after sending
    });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error exporting cards: ${err.message}`);
  }
});

export default router;
