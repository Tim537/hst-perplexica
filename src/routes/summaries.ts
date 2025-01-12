/**
 * Router handling summary-related operations including creation, retrieval,
 * listing, updating, and exporting summaries in different formats.
 */
import express from 'express';
import logger from '../utils/logger';
import db from '../db/index';
import { summaries } from '../db/schema';
import { eq } from 'drizzle-orm';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const router = express.Router();

/**
 * Create a new summary for a chat
 * @route POST /createSummary
 * @param {string} chatHistory - The content to be summarized
 * @param {number} chatId - The ID of the chat to create summary for
 * @returns {Object} Created summary object
 */
router.post('/createSummary', async (req, res) => {
  try {
    const { chatHistory, chatId } = req.body;

    // Validate required fields
    if (!chatHistory || !chatId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if summary already exists for this chat
    const existingSummary = await db
      .select()
      .from(summaries)
      .where(eq(summaries.chat, chatId))
      .execute();

    if (existingSummary.length > 0) {
      return res
        .status(400)
        .json({ message: 'A summary for this chat already exists.' });
    }

    // Create new summary in database
    const summaryContent = chatHistory || 'This is a placeholder summary.';

    const result = await db
      .insert(summaries)
      .values({
        content: summaryContent,
        chat: chatId,
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

/**
 * Retrieve a summary by chat ID
 * @route GET /:chatId/getSummary
 * @param {number} chatId - The ID of the chat to get summary for
 * @returns {Object} Summary object
 */
router.get('/:chatId/getSummary', async (req, res) => {
  try {
    const { chatId } = req.params;

    // Validate chatId
    if (!chatId) {
      return res.status(400).json({ message: 'Missing chatId' });
    }

    // Fetch summary from database
    const summary = await db
      .select()
      .from(summaries)
      .where(eq(summaries.chat, chatId))
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

/**
 * List all summaries
 * @route GET /listSummaries
 * @returns {Object[]} Array of summary objects
 */
router.get('/listSummaries', async (req, res) => {
  try {
    const summariesList = await db.select().from(summaries).execute();

    return res.status(200).json({ summaries: summariesList });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error listing summaries: ${err.message}`);
  }
});

/**
 * Update a summary's content
 * @route PUT /:id/updateSummary
 * @param {number} id - The ID of the summary to update
 * @param {string} content - The new content for the summary
 * @returns {Object} Updated summary object
 */
router.put('/:id/updateSummary', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validate content
    if (!content) {
      return res.status(400).json({ message: 'Missing content' });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'ID must be a number' });
    }

    // Update summary in database
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

/**
 * Export a summary in PDF or DOCX format
 * @route GET /:id/exportSummary
 * @param {number} id - The ID of the summary to export
 * @param {string} format - Export format ('pdf' or 'docx')
 * @returns {Buffer} File download in specified format
 */
router.get('/:id/exportSummary', async (req, res) => {
  try {
    const { id } = req.params;
    const format = req.query.format;

    // Validate ID
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'ID must be a number' });
    }

    // Fetch summary from database
    const summary = await db
      .select()
      .from(summaries)
      .where(eq(summaries.id, numericId))
      .execute();

    if (summary.length === 0) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    const summaryData = summary[0];

    // Handle PDF export
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
    }
    // Handle DOCX export
    else if (format === 'docx') {
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
