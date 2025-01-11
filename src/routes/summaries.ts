import express from 'express';
import logger from '../utils/logger';
import db from '../db/index';
import { summaries } from '../db/schema';
import { eq } from 'drizzle-orm';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const router = express.Router();

router.post('/createSummary', async (req, res) => {
  try {
    const { chatHistory, chatId } = req.body;

    if (!chatHistory || !chatId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const numericChatId = parseInt(chatId, 10);
    if (isNaN(numericChatId)) {
      return res.status(400).json({ message: 'chatId must be a number' });
    }

    const existingSummary = await db
      .select()
      .from(summaries)
      .where(eq(summaries.chatId, numericChatId))
      .execute();

    if (existingSummary.length > 0) {
      return res
        .status(400)
        .json({ message: 'A summary for this chat already exists.' });
    }

    // Placeholder for summary generation
    const summaryContent = chatHistory || 'This is a placeholder summary.';

    const result = await db
      .insert(summaries)
      .values({
        content: summaryContent,
        chatId: numericChatId,
      })
      .returning()
      .execute();

    const newSummary = result[0];

    return res
      .status(201)
      .json({ message: 'Summary created successfully', summary: newSummary });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error creating summary: ${err.message}`);
  }
});

router.get('/:chatId/getSummary', async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: 'Missing chatId' });
    }

    const numericChatId = parseInt(chatId, 10);
    if (isNaN(numericChatId)) {
      return res.status(400).json({ message: 'chatId must be a number' });
    }

    const summary = await db
      .select()
      .from(summaries)
      .where(eq(summaries.chatId, numericChatId))
      .execute();

    if (summary.length === 0) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    return res.status(200).json({ summary: summary[0] });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error retrieving summary: ${err.message}`);
  }
});

router.get('/listSummaries', async (req, res) => {
  try {
    const summariesList = await db.select().from(summaries).execute();

    return res.status(200).json({ summaries: summariesList });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error listing summaries: ${err.message}`);
  }
});

router.put('/:id/updateSummary', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Missing content' });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'ID must be a number' });
    }

    const updatedSummary = await db
      .update(summaries)
      .set({ content })
      .where(eq(summaries.id, numericId))
      .returning()
      .execute();

    if (updatedSummary.length === 0) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    return res.status(200).json({
      message: 'Summary updated successfully',
      summary: updatedSummary[0],
    });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error updating summary: ${err.message}`);
  }
});

router.get('/:id/exportSummary', async (req, res) => {
  try {
    const { id } = req.params;
    const format = req.query.format;

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'ID must be a number' });
    }

    const summary = await db
      .select()
      .from(summaries)
      .where(eq(summaries.id, numericId))
      .execute();

    if (summary.length === 0) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    const summaryData = summary[0];

    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=summary_${numericId}.pdf`,
      );
      doc.pipe(res);

      doc.text(`${summaryData.content}`);
      doc.end();
    } else if (format === 'docx') {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [new TextRun(`${summaryData.content}`)],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=summary_${numericId}.docx`,
      );
      res.send(buffer);
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid format. Use pdf or docx.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error exporting summary: ${err.message}`);
  }
});

export default router;
