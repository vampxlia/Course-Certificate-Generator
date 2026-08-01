// my_code
import {Request, Response} from "express";
import {checkPermission} from "../middlewares/checkPermission";

export const showDashboard = async (req: Request, res: Response) => {
    const userRole = (req as any).user?.role;

    const canAccessGenerator = await checkPermission(userRole, '/certificates/generate', 'GET');
    const canAccessMaintenance = await checkPermission(userRole, '/admin/maintenance', 'GET');
    const canAccessUsers = await checkPermission(userRole, '/admin/users', 'GET');
    const canAccessTemplates = await checkPermission(userRole, '/templates', 'GET');
    const canAccessSettings = await checkPermission(userRole, '/admin/settings', 'GET');
    res.render('index', {
        canAccessGenerator,
        canAccessMaintenance,
        canAccessUsers,
        canAccessTemplates,
        canAccessSettings
    });
};