import express from 'express';
import logger from '../utils/logger';
import db from '../db/index';
import { memories } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.get('/listMemories', async (_, res) => {
  try {
    const memoriesList = await db.query.memories.findMany();
    res.status(200).json({ memories: memoriesList });
  } catch (err: any) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error listing memories: ${err.message}`);
  }
});

router.post('/addMemory', async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const allowedTypes = ['text', 'image', 'video'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: 'Invalid type. Allowed types are text, image, and video.',
      });
    }

    const result = await db
      .insert(memories)
      .values({
        content,
        type,
      })
      .returning()
      .execute();

    const newMemory = result[0];

    return res
      .status(201)
      .json({ message: 'Memory added successfully', memory: newMemory });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error adding memory: ${err.message}`);
  }
});

router.delete('/:id/deleteMemory', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Memory ID is required' });
    }

    const memoryId = parseInt(id, 10);
    if (isNaN(memoryId)) {
      return res.status(400).json({ message: 'Invalid Memory ID' });
    }

    const deleteResult = await db
      .delete(memories)
      .where(eq(memories.id, memoryId))
      .execute();

    if (deleteResult.changes === 0) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    return res.status(200).json({ message: 'Memory deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error deleting memory: ${err.message}`);
  }
});

router.put('/editMemory', async (req, res) => {
  try {
    const { id, content, type } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Memory ID is required' });
    }

    const memoryId = parseInt(id, 10);
    if (isNaN(memoryId)) {
      return res.status(400).json({ message: 'Invalid Memory ID' });
    }

    if (!content && !type) {
      return res.status(400).json({
        message: 'At least one field (content or type) is required to update',
      });
    }

    const allowedTypes = ['text', 'image', 'video'];
    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({
        message: 'Invalid type. Allowed types are text, image, and video.',
      });
    }

    const updateData: any = {};
    if (content) updateData.content = content;
    if (type) updateData.type = type;

    const updateResult = await db
      .update(memories)
      .set(updateData)
      .where(eq(memories.id, memoryId))
      .execute();

    if (updateResult.changes === 0) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    return res.status(200).json({ message: 'Memory updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error updating memory: ${err.message}`);
  }
});

export default router;
