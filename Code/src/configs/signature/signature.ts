import path from "path";
import fs from "fs";

// Ensure we are always reading/writing to the exact same absolute path
export const P12_CERT_PATH = path.join(__dirname, "signature.p12");
const JSON_PATH = path.join(__dirname, "signature.json");

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
 * Safely reads the signature.json file at runtime.
 * Falls back to defaults if the file does not exist yet.
 */
function readJsonConfig(): WrittenSignatureSettings {
    if (!fs.existsSync(JSON_PATH)) {
        return {
            enabled: false,
            password: "",
            name: "",
            contactInfo: "",
            location: "",
            reason: "Autenticação de Certificado de Curso",
        };
    }
    try {
        return JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
    } catch (error) {
        console.error("Error reading signature.json, falling back to defaults:", error);
        return { enabled: false, password: "", name: "", contactInfo: "", location: "", reason: "" };
    }
}

/**
 * Reads persisted signature settings.
 */
export function getSignatureSettings(): SignatureSettings {
    const config = readJsonConfig();

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
    const config = readJsonConfig();

    const newSettings: WrittenSignatureSettings = {
        enabled: update.enabled ?? config.enabled,
        name: update.name ?? config.name,
        contactInfo: update.contactInfo ?? config.contactInfo,
        location: update.location ?? config.location,
        reason: update.reason ?? config.reason,
        // If a new password is provided, use it; otherwise keep the existing one
        password: update.password !== undefined ? update.password : config.password,
    };

    fs.writeFileSync(JSON_PATH, JSON.stringify(newSettings, null, 2), "utf8");
}