import express from 'express';
import logger from '../utils/logger';
import db from '../db/index';
import { eq } from 'drizzle-orm';
import { chats, messages } from '../db/schema';

const router = express.Router();
// get all chats
router.get('/', async (_, res) => {
  try {
    // using the chats schema to get all chats
    let chats = await db.query.chats.findMany();

    chats = chats.reverse();

    return res.status(200).json({ chats: chats });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting chats: ${err.message}`);
  }
});

// get a chat by id and its messages
router.get('/:id', async (req, res) => {
  try {
    // using the chats schema to get a chat by id
    const chatExists = await db.query.chats.findFirst({
      where: eq(chats.id, req.params.id),
    });

    if (!chatExists) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // using the messages schema to get all messages by chatId
    const chatMessages = await db.query.messages.findMany({
      where: eq(messages.chatId, req.params.id),
    });

    return res.status(200).json({ chat: chatExists, messages: chatMessages });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting chat: ${err.message}`);
  }
});
// get chat title by id
router.get('/title/:id', async (req, res) => {
  try {
    const chat = await db.query.chats.findFirst({
      where: eq(chats.id, req.params.id),
      columns: { title: true }  // Only select the title field
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.status(200).json({ title: chat.title });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error getting chat title: ${err.message}`);
  }
});

// delete a chat by id and its messages
router.delete(`/:id`, async (req, res) => {
  try {
    // using the chats schema to get a chat by id
    const chatExists = await db.query.chats.findFirst({
      where: eq(chats.id, req.params.id),
    });

    if (!chatExists) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // using the chats schema to delete a chat by id
    await db.delete(chats).where(eq(chats.id, req.params.id)).execute();
    // using the messages schema to delete all messages by chatId
    await db
      .delete(messages)
      .where(eq(messages.chatId, req.params.id))
      .execute();

    return res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in deleting chat: ${err.message}`);
  }
});

export default router;
