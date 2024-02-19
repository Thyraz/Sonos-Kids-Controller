export interface SonosApiConfig {
    server: string;
    port: string;
    useHttps?: boolean;
    rooms: string[];
    tts?: {
        enabled?: boolean;
        language?: string;
        volume?: string;
    };
}
