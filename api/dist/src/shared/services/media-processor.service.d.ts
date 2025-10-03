export interface MediaMetadata {
    type: 'music' | 'video' | 'unknown';
    platform: string;
    title?: string;
    artist?: string;
    album?: string;
    duration?: string;
    thumbnailUrl?: string;
    embedUrl?: string;
    streamingServices?: StreamingService[];
    videoOptions?: VideoDisplayOptions;
}
export interface StreamingService {
    platform: 'spotify' | 'apple_music' | 'youtube_music' | 'soundcloud' | 'amazon_music';
    url: string;
    available: boolean;
}
export interface VideoDisplayOptions {
    canEmbed: boolean;
    canAutoplay: boolean;
    canMute: boolean;
    embedUrl?: string;
    thumbnailUrl?: string;
}
export declare class MediaProcessorService {
    private readonly logger;
    private readonly musicPatterns;
    private readonly videoPatterns;
    processUrl(url: string): Promise<MediaMetadata>;
    private detectMusicUrl;
    private detectVideoUrl;
    private processSpotifyUrl;
    private processAppleMusicUrl;
    private processYouTubeMusicUrl;
    private processSoundCloudUrl;
    private processYouTubeUrl;
    private processVimeoUrl;
    private processTikTokUrl;
    private processInstagramUrl;
    findAlternativeStreamingServices(trackTitle: string, artist: string): Promise<StreamingService[]>;
}
