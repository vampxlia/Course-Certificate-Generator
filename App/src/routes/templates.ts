// my_code
import express from 'express';
import { getTemplatePage, getCreateTemplatePage, getEditTemplatePage, templateCreate, templateUpdate, templateDelete, previewTemplate } from '../controllers/templates';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

export const router = express.Router();

router.get('/', authenticate, authorize, getTemplatePage);
router.get('/create', authenticate, authorize, getCreateTemplatePage);
router.get('/edit/:id', authenticate, authorize, getEditTemplatePage);

router.post('/create', authenticate, authorize, templateCreate);
router.post('/update', authenticate, authorize, templateUpdate);
router.post('/delete', authenticate, authorize, templateDelete);
router.post('/preview', authenticate, authorize, previewTemplate);
