export interface SonosApiConfig {
    server: string;
    port: string;
    rooms: string[];
    tts?: {
        enabled?: boolean;
        language?: string;
        volume?: string;
    };
}
