export interface ArtworkResponseObject {
    artworkUrl100: string;
}

export interface ArtworkResponse {
    resultCount: number;
    results: ArtworkResponseObject[];
}