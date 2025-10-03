"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MediaProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaProcessorService = void 0;
const common_1 = require("@nestjs/common");
let MediaProcessorService = MediaProcessorService_1 = class MediaProcessorService {
    logger = new common_1.Logger(MediaProcessorService_1.name);
    musicPatterns = {
        spotify: /^https?:\/\/(open\.)?spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
        apple_music: /^https?:\/\/music\.apple\.com\/([a-z]{2}\/)?((album|song|playlist)\/[^\/]+\/)?(\d+)/,
        youtube_music: /^https?:\/\/music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        youtube: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
        soundcloud: /^https?:\/\/(www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/,
    };
    videoPatterns = {
        youtube: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
        vimeo: /^https?:\/\/(www\.)?vimeo\.com\/(\d+)/,
        tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[^\/]+\/video\/(\d+)/,
        instagram: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/,
    };
    async processUrl(url) {
        this.logger.log(`Processing URL: ${url}`);
        const musicResult = await this.detectMusicUrl(url);
        if (musicResult.type === 'music') {
            return musicResult;
        }
        const videoResult = await this.detectVideoUrl(url);
        if (videoResult.type === 'video') {
            return videoResult;
        }
        return {
            type: 'unknown',
            platform: 'unknown'
        };
    }
    async detectMusicUrl(url) {
        if (this.musicPatterns.spotify.test(url)) {
            return this.processSpotifyUrl(url);
        }
        if (this.musicPatterns.apple_music.test(url)) {
            return this.processAppleMusicUrl(url);
        }
        if (this.musicPatterns.youtube_music.test(url)) {
            return this.processYouTubeMusicUrl(url);
        }
        if (this.musicPatterns.soundcloud.test(url)) {
            return this.processSoundCloudUrl(url);
        }
        if (this.musicPatterns.youtube.test(url)) {
            return this.processYouTubeUrl(url, 'music');
        }
        return { type: 'unknown', platform: 'unknown' };
    }
    async detectVideoUrl(url) {
        if (this.videoPatterns.youtube.test(url)) {
            return this.processYouTubeUrl(url, 'video');
        }
        if (this.videoPatterns.vimeo.test(url)) {
            return this.processVimeoUrl(url);
        }
        if (this.videoPatterns.tiktok.test(url)) {
            return this.processTikTokUrl(url);
        }
        if (this.videoPatterns.instagram.test(url)) {
            return this.processInstagramUrl(url);
        }
        return { type: 'unknown', platform: 'unknown' };
    }
    async processSpotifyUrl(url) {
        const match = url.match(this.musicPatterns.spotify);
        if (!match)
            return { type: 'unknown', platform: 'spotify' };
        const [, , type, id] = match;
        const mockMetadata = {
            type: 'music',
            platform: 'spotify',
            title: 'Sample Track Title',
            artist: 'Sample Artist',
            album: 'Sample Album',
            duration: '3:45',
            thumbnailUrl: 'https://via.placeholder.com/300x300?text=Album+Art',
            embedUrl: `https://open.spotify.com/embed/track/${id}`,
            streamingServices: [
                { platform: 'spotify', url, available: true },
                { platform: 'apple_music', url: '#', available: false },
                { platform: 'youtube_music', url: '#', available: false },
            ]
        };
        return mockMetadata;
    }
    async processAppleMusicUrl(url) {
        return {
            type: 'music',
            platform: 'apple_music',
            title: 'Sample Track Title',
            artist: 'Sample Artist',
            album: 'Sample Album',
            duration: '3:45',
            thumbnailUrl: 'https://via.placeholder.com/300x300?text=Album+Art',
            streamingServices: [
                { platform: 'apple_music', url, available: true },
                { platform: 'spotify', url: '#', available: false },
                { platform: 'youtube_music', url: '#', available: false },
            ]
        };
    }
    async processYouTubeMusicUrl(url) {
        const match = url.match(this.musicPatterns.youtube_music);
        if (!match)
            return { type: 'unknown', platform: 'youtube_music' };
        const videoId = match[1];
        return {
            type: 'music',
            platform: 'youtube_music',
            title: 'Sample Music Video',
            artist: 'Sample Artist',
            duration: '4:12',
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            streamingServices: [
                { platform: 'youtube_music', url, available: true },
                { platform: 'spotify', url: '#', available: false },
                { platform: 'apple_music', url: '#', available: false },
            ]
        };
    }
    async processSoundCloudUrl(url) {
        return {
            type: 'music',
            platform: 'soundcloud',
            title: 'Sample SoundCloud Track',
            artist: 'Sample Artist',
            duration: '5:30',
            thumbnailUrl: 'https://via.placeholder.com/300x300?text=SoundCloud',
            streamingServices: [
                { platform: 'soundcloud', url, available: true },
            ]
        };
    }
    async processYouTubeUrl(url, contentType) {
        const match = url.match(this.videoPatterns.youtube);
        if (!match)
            return { type: 'unknown', platform: 'youtube' };
        const videoId = match[3];
        const baseMetadata = {
            platform: 'youtube',
            title: contentType === 'music' ? 'Sample Music Video' : 'Sample Video',
            duration: '4:12',
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
        };
        if (contentType === 'music') {
            return {
                ...baseMetadata,
                type: 'music',
                artist: 'Sample Artist',
                streamingServices: [
                    { platform: 'youtube_music', url, available: true },
                    { platform: 'spotify', url: '#', available: false },
                    { platform: 'apple_music', url: '#', available: false },
                ]
            };
        }
        else {
            return {
                ...baseMetadata,
                type: 'video',
                videoOptions: {
                    canEmbed: true,
                    canAutoplay: true,
                    canMute: true,
                    embedUrl: `https://www.youtube.com/embed/${videoId}`,
                    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                }
            };
        }
    }
    async processVimeoUrl(url) {
        const match = url.match(this.videoPatterns.vimeo);
        if (!match)
            return { type: 'unknown', platform: 'vimeo' };
        const videoId = match[2];
        return {
            type: 'video',
            platform: 'vimeo',
            title: 'Sample Vimeo Video',
            duration: '6:45',
            thumbnailUrl: 'https://via.placeholder.com/640x360?text=Vimeo+Video',
            embedUrl: `https://player.vimeo.com/video/${videoId}`,
            videoOptions: {
                canEmbed: true,
                canAutoplay: true,
                canMute: true,
                embedUrl: `https://player.vimeo.com/video/${videoId}`,
                thumbnailUrl: 'https://via.placeholder.com/640x360?text=Vimeo+Video',
            }
        };
    }
    async processTikTokUrl(url) {
        return {
            type: 'video',
            platform: 'tiktok',
            title: 'Sample TikTok Video',
            duration: '0:30',
            thumbnailUrl: 'https://via.placeholder.com/360x640?text=TikTok+Video',
            videoOptions: {
                canEmbed: false,
                canAutoplay: false,
                canMute: false,
            }
        };
    }
    async processInstagramUrl(url) {
        return {
            type: 'video',
            platform: 'instagram',
            title: 'Sample Instagram Video',
            duration: '1:15',
            thumbnailUrl: 'https://via.placeholder.com/400x400?text=Instagram+Video',
            videoOptions: {
                canEmbed: false,
                canAutoplay: false,
                canMute: false,
            }
        };
    }
    async findAlternativeStreamingServices(trackTitle, artist) {
        return [
            { platform: 'spotify', url: 'https://open.spotify.com/search', available: false },
            { platform: 'apple_music', url: 'https://music.apple.com/search', available: false },
            { platform: 'youtube_music', url: 'https://music.youtube.com/search', available: false },
        ];
    }
};
exports.MediaProcessorService = MediaProcessorService;
exports.MediaProcessorService = MediaProcessorService = MediaProcessorService_1 = __decorate([
    (0, common_1.Injectable)()
], MediaProcessorService);
//# sourceMappingURL=media-processor.service.js.map