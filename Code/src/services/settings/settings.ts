import {getSignatureSettings, P12_CERT_PATH, saveSignatureSettings} from "../../configs/signature/signature";
import fs from "fs";
import {saveCertificateRepositorySettings} from "../../configs/certificates/certificateDB";

export interface UpdateSignaturePayload {
    name?: string;
    contact?: string;
    location?: string;
    reason?: string;
    passphrase?: string;
    enabled?: string;
    fileBuffer?: Buffer;
}

export interface UpdateRepositoryPayload {
    maxSize?: string;
    maxSizeUnit?: string;
    maxUsePercentage?: string;
}

/**
 * Fetches the current application digital signature configurations.
 */
export function fetchSignatureSettings() {
    return getSignatureSettings();
}

/**
 * Persists updated digital signature settings and handles .p12 certificate file writes.
 */
export async function updateSignature(payload: UpdateSignaturePayload): Promise<void> {
    // If a new .p12 file buffer was uploaded, handle file system persistence
    if (payload.fileBuffer) {
        fs.writeFileSync(P12_CERT_PATH, payload.fileBuffer);
    }

    saveSignatureSettings({
        enabled: payload.enabled === "on" || payload.enabled === "true",
        name: payload.name || "",
        contactInfo: payload.contact || "",
        location: payload.location || "",
        reason: payload.reason || "Autenticação de Certificado de Curso",
        ...(payload.passphrase ? { password: payload.passphrase } : {}),
    });
}

/**
 * Updates local repository constraints including maximum size allowances and usage safe-guard thresholds.
 */
export async function updateRepository(payload: UpdateRepositoryPayload): Promise<void> {
    let maxSizeBites: number | undefined = undefined;

    if (payload.maxSize && payload.maxSize.trim() !== "") {
        const parsedSize = parseFloat(payload.maxSize);

        if (!isNaN(parsedSize)) {
            switch (payload.maxSizeUnit) {
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

    const percentage = payload.maxUsePercentage ? parseInt(payload.maxUsePercentage, 10) : undefined;

    saveCertificateRepositorySettings({
        maxSizeBites,
        maxUsePercentage: isNaN(percentage as number) ? undefined : percentage,
    });
}