import express from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import {
    getUsersPage,
    getCreateUserPage,
    createUser,
    getEditUserPage,
    updateUser,
    deleteUser,
} from '../controllers/admin';

export const router = express.Router();

router.get('/users',            authenticate, authorize, getUsersPage);
router.get('/users/create',     authenticate, authorize, getCreateUserPage);
router.post('/users/create',    authenticate, authorize, createUser);
router.get('/users/edit/:id',   authenticate, authorize, getEditUserPage);
router.post('/users/edit/:id',  authenticate, authorize, updateUser);
router.post('/users/delete/:id',authenticate, authorize, deleteUser);
