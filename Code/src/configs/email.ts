interface EmailSettings {
    readonly host: string;
    readonly user: string;
    readonly port: number;
    readonly password: string;
    readonly sender: string;
}

export const emailConfig = {
    get settings(): EmailSettings {
        return {
            host: process.env.EMAIL_HOST ?? '',
            user: process.env.EMAIL_USER ?? '',
            port: Number(process.env.EMAIL_PORT ?? 587), // Default fallback port
            password: process.env.EMAIL_PASSWORD ?? '',
            sender: process.env.EMAIL_SENDER ?? ''
        };
    }
};