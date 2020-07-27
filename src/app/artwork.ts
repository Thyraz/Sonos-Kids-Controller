export interface ArtworkResponseImage {
    height: number;
    url: string;
}

export interface ArtworkResponseArtist {
    name: string;
}

export interface ArtworkResponseItem {
    images: ArtworkResponseImage[];
    name: string;
    artists: ArtworkResponseArtist[];
}

export interface ArtworkResponse {
    albums: {
        total: number;
        items: ArtworkResponseItem[];
    };
}