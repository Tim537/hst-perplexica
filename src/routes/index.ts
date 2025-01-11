import express from 'express';
import imagesRouter from './images';
import videosRouter from './videos';
import configRouter from './config';
import modelsRouter from './models';
import suggestionsRouter from './suggestions';
import chatsRouter from './chats';
import searchRouter from './search';
import discoverRouter from './discover';
import uploadsRouter from './uploads';
import memoriesRouter from './memories';
import summariesRouter from './summaries';
import cardsRouter from './cards';
const router = express.Router();

router.use('/images', imagesRouter);
router.use('/videos', videosRouter);
router.use('/config', configRouter);
router.use('/models', modelsRouter);
router.use('/suggestions', suggestionsRouter);
router.use('/chats', chatsRouter);
router.use('/search', searchRouter);
router.use('/discover', discoverRouter);
router.use('/uploads', uploadsRouter);
router.use('/memories', memoriesRouter);
router.use('/summaries', summariesRouter);
router.use('/cards', cardsRouter);

export default router;
