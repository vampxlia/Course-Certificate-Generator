import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(__dirname, "certificateConfigs.json");

export interface repositorySettings {
    maxSizeBites: number
    maxUsePercentage: number
}

export function getRepositorySettings(): repositorySettings {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return {
        maxSizeBites: config.maxSizeBites,
        maxUsePercentage: config.maxUsePercentage
    }
}

export function saveCertificateRepositorySettings(update: Partial<Omit<repositorySettings, number>>) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    const newSettings: repositorySettings = {
        maxSizeBites: update.maxSizeBites ?? config.maxSizeBites,
        maxUsePercentage: update.maxUsePercentage ?? config.maxUsePercentage,
    };

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newSettings, null, 2), "utf8");
}