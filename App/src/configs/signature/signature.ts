import path from "path";
import fs from "fs";

export const P12_CERT_PATH = path.join(__dirname, "signature.p12");
const CONFIG_PATH = path.join(__dirname, "signatureConfigs.json");

export interface WrittenSignatureSettings {
    enabled: boolean;
    password: string;
    name: string;
    contactInfo: string;
    location: string;
    reason: string;
}

export interface SignatureSettings extends WrittenSignatureSettings {
    hasCertificate: boolean;
}



/**
 * Reads persisted signature settings.
 */
export function getSignatureSettings(): SignatureSettings {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return {
        enabled: config.enabled,
        name: config.name,
        contactInfo: config.contactInfo,
        location: config.location,
        reason: config.reason,
        password: config.password,
        hasCertificate: fs.existsSync(P12_CERT_PATH),
    };
}

/**
 * Saves signature settings.
 */
export function saveSignatureSettings(update: Partial<Omit<SignatureSettings, "hasCertificate">>): void {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    const newSettings: WrittenSignatureSettings = {
        enabled: update.enabled ?? config.enabled,
        name: update.name ?? config.name,
        contactInfo: update.contactInfo ?? config.contactInfo,
        location: update.location ?? config.location,
        reason: update.reason ?? config.reason,
        // If a new password is provided, use it; otherwise keep the existing one
        password: update.password !== undefined ? update.password : config.password,
    };

    fs.writeFileSync('./signatureConfigs.json', JSON.stringify(newSettings, null, 2), "utf8");
}