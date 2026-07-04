import { Request, Response } from "express";
import fs from "fs";
import {getSignatureSettings, P12_CERT_PATH, saveSignatureSettings} from "../configs/signature/signature";
import {saveCertificateRepositorySettings} from "../configs/certificates/certificateDB";

/** GET /admin/settings */
export const getSettingsPage = (_req: Request, res: Response) => {
    const signatureSettings = getSignatureSettings();
    res.render("admin/settings", {
        signatureSettings,
        successMessage: null,
        errorMessage: null,
    });
};

/** POST /admin/settings/signature */
export const updateSignatureSettings = (req: Request, res: Response) => {
    try {
        const { name, contact, location, reason, passphrase: password, enabled } = req.body;
        const uploadedFile = (req as any).file as Express.Multer.File | undefined;

        // If a new .p12 file was uploaded, overwrite the stored certificate
        if (uploadedFile) {
            fs.writeFileSync(P12_CERT_PATH, uploadedFile.buffer);
        }

        saveSignatureSettings({
            enabled: enabled === "on" || enabled === "true",
            name: name || "",
            contactInfo: contact || "",
            location: location || "",
            reason: reason || "Autenticação de Certificado de Curso",
            // Only update passphrase if a new non-empty value was provided
            ...(password ? { password: password } : {}),
        });

        renderSettings (res, "Definições de assinatura guardadas com sucesso!", null);
    } catch (error) {
        console.error("Error saving signature settings:", error);
        renderSettings (res, null, "Erro ao guardar as definições de assinatura. Tente novamente.");
    }
};

//POST /admin/settings/repo
export const updateRepositorySettings = (req: Request, res: Response) => {
    try {
        const { maxSize, maxSizeUnit, maxUsePercentage } = req.body;

        let maxSizeBites: number | undefined = undefined;

        if (maxSize && maxSize.trim() !== "") {
            const parsedSize = parseFloat(maxSize);

            if (!isNaN(parsedSize)) {
                switch (maxSizeUnit) {
                    case "KB":
                        maxSizeBites = Math.round(parsedSize * 1024);
                        break;
                    case "MB":
                        maxSizeBites = Math.round(parsedSize * 1024 * 1024);
                        break;
                    case "GB":
                        maxSizeBites = Math.round(parsedSize * 1024 * 1024 * 1024);
                        break;
                    case "B":
                    default:
                        maxSizeBites = Math.round(parsedSize);
                        break;
                }
            }
        }

        const percentage = maxUsePercentage ? parseInt(maxUsePercentage, 10) : undefined;

        saveCertificateRepositorySettings({
            maxSizeBites,
            maxUsePercentage: isNaN(percentage as number) ? undefined : percentage,
        });

        renderSettings(res, "Definições de armazenamento local guardadas com sucesso!", null);
    } catch (error) {
        console.error("Error saving certificate storage settings:", error);
        renderSettings(res, null, "Erro ao guardar as definições de armazenamento.");
    }
};

/*
//POST /admin/settings/email
export const updateEmailSettings = (req: Request, res: Response) => {
    try {
        const { emailHost, emailPort, emailUser, emailPassword, emailSender } = req.body;

        const port = parseInt(emailPort, 10);
        if (isNaN(port) || port < 1 || port > 65535) {
            return renderSettings (res, null, "Porto SMTP inválido. Use um valor entre 1 e 65535 (ex: 587 ou 465).");
        }

        saveEmailSettings({
            host: emailHost || "",
            port,
            user: emailUser || "",
            sender: emailSender || "",
            // Preserve existing password if field left blank
            ...(emailPassword ? { password: emailPassword } : {}),
        });

        renderSettings (res, "Definições de email guardadas com sucesso!", null);
    } catch (error) {
        console.error("Error saving email settings:", error);
        renderSettings (res, null, "Erro ao guardar as definições de email. Tente novamente.");
    }
};*/

function renderSettings (res: Response, successMessage: string | null, errorMessage: string | null) {
    res.render("admin/settings", {
        signatureSettings: getSignatureSettings(),
        successMessage,
        errorMessage,
    });
}
