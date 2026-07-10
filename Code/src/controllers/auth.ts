import { Request, Response } from 'express';
import { validateCredentials } from "../services/auth/auth";

export function showLogin(req: Request, res: Response) {
    res.render('login', {
        errorMessage: null,
        successMessage: null,
    });
}

export async function login(req: Request, res: Response) {
    const email = String(req.body?.email || '').trim();
    const password = String(req.body?.password || '');

    const user = await validateCredentials(email, password);

    if (user != null) {
        const cookieOptions = {
            httpOnly: true,                                // Prevents client-side scripts from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Forces HTTPS in production (allows HTTP for local development)
            sameSite: 'lax' as const,                      // Protects against CSRF attacks
            maxAge: 60 * 60 * 1000,                        // Lasts 1 hour
        };

        res.cookie('auth_user', user.email, cookieOptions);
        res.cookie('auth_role', user.role, cookieOptions);
        res.cookie('auth_name', user.employeeName, cookieOptions);

        return res.redirect('/');
    }

    return res.render('login', {
        errorMessage: 'Credenciais inválidas.',
        successMessage: null,
    });
}

export function logout(req: Request, res: Response) {
    res.clearCookie('auth_user');
    res.clearCookie('auth_role');
    res.clearCookie('auth_name');
    return res.redirect('/auth/login');
}