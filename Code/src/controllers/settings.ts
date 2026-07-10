import { Request, Response } from "express";
import {fetchSignatureSettings, updateRepository, updateSignature} from "../services/settings/settings";

/** Helper to handle standardized rendering */
const renderSettingsView = (res: Response, successMessage: string | null, errorMessage: string | null) => {
    res.render("admin/settings", {
        signatureSettings: fetchSignatureSettings(),
        successMessage,
        errorMessage,
    });
};

/** GET /admin/settings */
export const getSettingsPage = (_req: Request, res: Response) => {
    renderSettingsView(res, null, null);
};

/** POST /admin/settings/signature */
export const updateSignatureSettings = async (req: Request, res: Response) => {
    try {
        const uploadedFile = (req as any).file as Express.Multer.File | undefined;

        // Controller extracts and builds a clean payload to send down
        await updateSignature({
            name: req.body.name,
            contact: req.body.contact,
            location: req.body.location,
            reason: req.body.reason,
            passphrase: req.body.passphrase,
            enabled: req.body.enabled,
            fileBuffer: uploadedFile?.buffer
        });

        renderSettingsView(res, "Definições de assinatura guardadas com sucesso!", null);
    } catch (error) {
        console.error("Error saving signature settings:", error);
        renderSettingsView(res, null, "Erro ao guardar as definições de assinatura. Tente novamente.");
    }
};

/** POST /admin/settings/repo */
export const updateRepositorySettings = async (req: Request, res: Response) => {
    try {
        // Controller safely passes the body parameters to the service layout
        await updateRepository({
            maxSize: req.body.maxSize,
            maxSizeUnit: req.body.maxSizeUnit,
            maxUsePercentage: req.body.maxUsePercentage
        });

        renderSettingsView(res, "Definições de armazenamento local guardadas com sucesso!", null);
    } catch (error) {
        console.error("Error saving certificate storage settings:", error);
        renderSettingsView(res, null, "Erro ao guardar as definições de armazenamento.");
    }
};