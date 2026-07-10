import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: any, res: any, next: NextFunction) => {
    const userEmail = req.cookies?.auth_user;

    if (!userEmail) {
        return res.redirect('/auth/login');
    }

    req.user = {
        email: userEmail,
        role: req.cookies?.auth_role
    };

    next();
};