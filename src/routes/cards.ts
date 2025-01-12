import express from 'express';
import logger from '../utils/logger';
import db from '../db/index';
import { stacks, cards } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.post('/createStack', async (req, res) => {
  try {
    const { chatHistory, chatId } = req.body;

    if (!chatHistory || !chatId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const numericChatId = parseInt(chatId, 10);
    if (isNaN(numericChatId)) {
      return res.status(400).json({ message: 'chatId must be a number' });
    }

    const existingStack = await db
      .select()
      .from(stacks)
      .where(eq(stacks.chatId, numericChatId))
      .execute();

    if (existingStack.length > 0) {
      return res
        .status(400)
        .json({ message: 'A stack for this chat already exists.' });
    }

    // Placeholder for stack and card creation
    const exampleCard = {
      front: 'Example card front',
      back: 'Example card back',
      stackId: numericChatId,
    };

    const cardResult = await db
      .insert(cards)
      .values(exampleCard)
      .returning()
      .execute();

    const newCard = cardResult[0];

    const exampleCard2 = {
      front: 'Second example card front',
      back: 'Second example card back',
      stackId: numericChatId,
    };

    const cardResult2 = await db
      .insert(cards)
      .values(exampleCard2)
      .returning()
      .execute();

    const newCard2 = cardResult2[0];

    const result = await db
      .insert(stacks)
      .values({
        chatId: numericChatId,
        cardIds: [newCard.id, newCard2.id],
      })
      .returning()
      .execute();

    const newStack = result[0];

    return res
      .status(201)
      .json({ message: 'Stack created successfully', stack: newStack });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error creating stack: ${err.message}`);
  }
});

router.get('/listStacks/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;

    const numericChatId = parseInt(chatId, 10);
    if (isNaN(numericChatId)) {
      return res.status(400).json({ message: 'chatId must be a number' });
    }

    const stack = await db
      .select()
      .from(stacks)
      .where(eq(stacks.chatId, numericChatId))
      .execute()
      .then((result) => result[0]);

    if (!stack) {
      return res.status(404).json({ message: 'Stack not found' });
    }

    // TODO: Populate cards

    return res.status(200).json();
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error listing stacks: ${err.message}`);
  }
});

export default router;
