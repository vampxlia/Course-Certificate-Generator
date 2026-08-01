// my_code
import {authenticate} from "../middlewares/authenticate";
import {deleteBeforeDate, deleteBeforeStudentNumber, deleteNow, getMaintenancePage, deleteByCourse, previewCertificate} from "../controllers/maintenance";
import {authorize} from "../middlewares/authorize";
import express from 'express';

export const router = express.Router();

router.get('/maintenance', authenticate, authorize, getMaintenancePage);
router.post('/maintenance/delete', authenticate, authorize, deleteNow);
router.post('/maintenance/delete-before', authenticate, authorize, deleteBeforeDate);
router.post('/maintenance/delete-before-student-number', authenticate, authorize, deleteBeforeStudentNumber);
router.post('/maintenance/delete-by-course', authenticate, authorize, deleteByCourse);
router.get('/maintenance/preview/:fileName', authenticate, authorize, previewCertificate);