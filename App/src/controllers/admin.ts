// my_code
import { Request, Response } from 'express';
import { IUserDAO } from '../dao/interfaces/IUserDAO';
import { SqlUserDAO } from '../dao/implementations/sql/sqlUserDAO';
import { userRole } from '../model/user';
import { generateHashedPassword } from '../services/auth/auth'
import cookieParser from "cookie-parser";
import {logout} from "./auth";

const userDAO: IUserDAO = new SqlUserDAO();

// GET /admin/users
export const getUsersPage = async (req: Request, res: Response) => {
    try {
        const users = await userDAO.getAllUsers();
        const successMessage = (req.query.success as string) || null;
        const errorMessage   = (req.query.error   as string) || null;
        res.render('admin/users', { users, successMessage, errorMessage });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('error', { message: 'Failed to load users.' });
    }
};

// GET /admin/users/create
export const getCreateUserPage = (_req: Request, res: Response) => {
    res.render('admin/create-user', { errorMessage: null });
};

// POST /admin/users/create
export const createUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
        return res.render('admin/create-user', {
            errorMessage: 'All camps are mandatory.'
        });
    }

    if (!Object.values(userRole).includes(role)) {
        return res.render('admin/create-user', {
            errorMessage: 'Invalid role.'
        });
    }

    try {
        const hashedPassword = generateHashedPassword(password);
        await userDAO.createUser(firstName, lastName, email, hashedPassword, role as userRole);
        res.redirect('/admin/users?success=User+created+successfully.');
    } catch (error) {
        console.error('Error creating user:', error);
        res.render('admin/create-user', {
            errorMessage: 'Error creating user. The email might already be in use.'
        });
    }
};

// GET /admin/users/edit/:id
export const getEditUserPage = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return res.status(400).render('error', { message: 'Invalid ID.' });

    try {
        const user = await userDAO.getUserById(id);
        if (!user) return res.status(404).render('error', { message: 'User not found.' });

        // Split employeeName back into firstName / lastName for form pre-fill
        const parts = user.employeeName.split(' ');
        const firstName = parts[0] ?? '';
        const lastName  = parts.slice(1).join(' ');

        res.render('admin/edit-user', { user, firstName, lastName, errorMessage: null });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).render('error', { message: 'Error loading user.' });
    }
};

// POST /admin/users/edit/:id
export const updateUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return res.status(400).render('error', { message: 'Invalid ID.' });

    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !role) {
        const user = await userDAO.getUserById(id).catch(() => null);
        const parts = user?.employeeName.split(' ') ?? ['', ''];
        return res.render('admin/edit-user', {
            user,
            firstName: parts[0],
            lastName: parts.slice(1).join(' '),
            errorMessage: 'The fields name, email and role are mandatory.'
        });
    }

    if (!Object.values(userRole).includes(role)) {
        const user = await userDAO.getUserById(id).catch(() => null);
        const parts = user?.employeeName.split(' ') ?? ['', ''];
        return res.render('admin/edit-user', {
            user,
            firstName: parts[0],
            lastName: parts.slice(1).join(' '),
            errorMessage: 'Role inválida.'
        });
    }

    try {
        const hashedPassword = password ? generateHashedPassword(password) : undefined;
        await userDAO.updateUser(id, firstName, lastName, email, role as userRole, hashedPassword);
        res.redirect('/admin/users?success=User+updated+successfully.');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).render('error', { message: 'Error updating user.' });
    }
};

// POST /admin/users/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return res.status(400).render('error', { message: 'Invalid ID.' });

    try {
        await userDAO.deleteUser(id);
        if(id == req.cookies?.auth_id) {
            logout(req, res)
        } else {
            res.redirect('/admin/users?success=User+deleted+successfully.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.redirect('/admin/users?error=Error+deleting+user.');
    }
};
