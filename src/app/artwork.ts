export interface ArtworkResponseImage {
    height: number;
    url: string;
}

export interface ArtworkResponseItem {
    images: ArtworkResponseImage[];
}

export interface ArtworkResponse {
    albums: {
        total: number;
        items: ArtworkResponseItem[];
    };
}