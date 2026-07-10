import {getEnforcer} from "../configs/casbin/casbin";

export const checkPermission = async (role: string, path: string, method: string): Promise<boolean> => {
    try {
        const enforcer = await getEnforcer();
        return await enforcer.enforce(role, path, method);
    } catch (error) {
        console.error('Permission check error:', error);
        return false;
    }
};