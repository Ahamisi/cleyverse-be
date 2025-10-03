import { Injectable, Logger } from '@nestjs/common';

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

@Injectable()
export class MediaProcessorService {
  private readonly logger = new Logger(MediaProcessorService.name);

  // Music platform patterns
  private readonly musicPatterns = {
    spotify: /^https?:\/\/(open\.)?spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    apple_music: /^https?:\/\/music\.apple\.com\/([a-z]{2}\/)?((album|song|playlist)\/[^\/]+\/)?(\d+)/,
    youtube_music: /^https?:\/\/music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    youtube: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    soundcloud: /^https?:\/\/(www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/,
  };

  // Video platform patterns
  private readonly videoPatterns = {
    youtube: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    vimeo: /^https?:\/\/(www\.)?vimeo\.com\/(\d+)/,
    tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[^\/]+\/video\/(\d+)/,
    instagram: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/,
  };

  async processUrl(url: string): Promise<MediaMetadata> {
    this.logger.log(`Processing URL: ${url}`);

    // Check if it's a music URL
    const musicResult = await this.detectMusicUrl(url);
    if (musicResult.type === 'music') {
      return musicResult;
    }

    // Check if it's a video URL
    const videoResult = await this.detectVideoUrl(url);
    if (videoResult.type === 'video') {
      return videoResult;
    }

    return {
      type: 'unknown',
      platform: 'unknown'
    };
  }

  private async detectMusicUrl(url: string): Promise<MediaMetadata> {
    // Spotify
    if (this.musicPatterns.spotify.test(url)) {
      return this.processSpotifyUrl(url);
    }

    // Apple Music
    if (this.musicPatterns.apple_music.test(url)) {
      return this.processAppleMusicUrl(url);
    }

    // YouTube Music
    if (this.musicPatterns.youtube_music.test(url)) {
      return this.processYouTubeMusicUrl(url);
    }

    // SoundCloud
    if (this.musicPatterns.soundcloud.test(url)) {
      return this.processSoundCloudUrl(url);
    }

    // Regular YouTube (could be music)
    if (this.musicPatterns.youtube.test(url)) {
      return this.processYouTubeUrl(url, 'music');
    }

    return { type: 'unknown', platform: 'unknown' };
  }

  private async detectVideoUrl(url: string): Promise<MediaMetadata> {
    // YouTube
    if (this.videoPatterns.youtube.test(url)) {
      return this.processYouTubeUrl(url, 'video');
    }

    // Vimeo
    if (this.videoPatterns.vimeo.test(url)) {
      return this.processVimeoUrl(url);
    }

    // TikTok
    if (this.videoPatterns.tiktok.test(url)) {
      return this.processTikTokUrl(url);
    }

    // Instagram
    if (this.videoPatterns.instagram.test(url)) {
      return this.processInstagramUrl(url);
    }

    return { type: 'unknown', platform: 'unknown' };
  }

  private async processSpotifyUrl(url: string): Promise<MediaMetadata> {
    const match = url.match(this.musicPatterns.spotify);
    if (!match) return { type: 'unknown', platform: 'spotify' };

    const [, , type, id] = match;
    
    // In real implementation, use Spotify API to get metadata
    const mockMetadata: MediaMetadata = {
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

  private async processAppleMusicUrl(url: string): Promise<MediaMetadata> {
    // Mock implementation - in real app, use Apple Music API
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

  private async processYouTubeMusicUrl(url: string): Promise<MediaMetadata> {
    const match = url.match(this.musicPatterns.youtube_music);
    if (!match) return { type: 'unknown', platform: 'youtube_music' };

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

  private async processSoundCloudUrl(url: string): Promise<MediaMetadata> {
    // Mock implementation - in real app, use SoundCloud API
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

  private async processYouTubeUrl(url: string, contentType: 'music' | 'video'): Promise<MediaMetadata> {
    const match = url.match(this.videoPatterns.youtube);
    if (!match) return { type: 'unknown', platform: 'youtube' };

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
    } else {
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

  private async processVimeoUrl(url: string): Promise<MediaMetadata> {
    const match = url.match(this.videoPatterns.vimeo);
    if (!match) return { type: 'unknown', platform: 'vimeo' };

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

  private async processTikTokUrl(url: string): Promise<MediaMetadata> {
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

  private async processInstagramUrl(url: string): Promise<MediaMetadata> {
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

  // Helper method to get available streaming services for a track
  async findAlternativeStreamingServices(trackTitle: string, artist: string): Promise<StreamingService[]> {
    // In real implementation, this would search across platforms
    // For now, return mock data
    return [
      { platform: 'spotify', url: 'https://open.spotify.com/search', available: false },
      { platform: 'apple_music', url: 'https://music.apple.com/search', available: false },
      { platform: 'youtube_music', url: 'https://music.youtube.com/search', available: false },
    ];
  }
}
