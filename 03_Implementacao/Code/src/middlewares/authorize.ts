import { Request, Response, NextFunction } from 'express';
import {getEnforcer} from "../configs/casbin/casbin";

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = (req as any).user?.role;

        if (!userRole) {
            return res.status(401).json({ error: 'Unauthorized: User role not found.' });
        }

        const fullPath = req.originalUrl.split('?')[0];
        const method = req.method;

        const enforcer = await getEnforcer();
        const isAllowed = await enforcer.enforce(userRole, fullPath, method);

        if (isAllowed) {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
        }
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ error: 'Internal Server Error during authorization.' });
    }
};