import { MusicGenre } from '@/types';
import BaseClient from '@/clients/base';

class SpotifyMusicPlayer extends BaseClient {
    constructor(authorization: string) {
        super(
            process.env.SPOTIFY_API_URL!, 
            {'Authorization': `Bearer ${authorization}`}
        );
    }

    // search
    async searchPlaylistByGenre(genre: MusicGenre) {
        return await this._get(
            '/search',
            {
                q: genre,
                type: 'playlist',
                offset: Math.floor(Math.random() * 950)
            }
        );
    }

    async searchTrackByGenre(genre: MusicGenre) {
        return await this._get(
            '/search',
            {
                q: `genre:${genre}`,
                type: 'track',
                offset: Math.floor(Math.random() * 950),
                limit: 50
            }
        );
    }
    
    // configuration
    async getDevices() {
        return await this._get('/me/player/devices');
    }

    async getPlaylists() {
        return await this._get('/me/playlists');
    }

    async setPlayer(id: string) {
        return await this._put(
            '/me/player',
            {
                device_ids: [id],
                play: true
            }
        );
    }

    // favorites 
    async removeFromFavorites(id: string) {
        return await this._delete(
            '/me/tracks',
            {
                ids: [id]
            }
        );
    }

    async addToFavorites(id: string) {
        return await this._put(
            '/me/tracks',
            {
                ids: [id]
            }
        );
    }

    async checkInFavorites(id: string) {
        return await this._get(
            '/me/tracks/contains',
            {
                ids: id
            }
        );
    }

    // play
    async startPlaying(trackIds?: string[]) {
        const data = trackIds 
        ? { uris: trackIds.map(id => `spotify:track:${id}`) } 
        : {};

        return await this._put(
            '/me/player/play',
            data
        );
    }

    async getCurrentlyPlayingTrack() {
        return await this._get('/me/player/currently-playing');
    }

    async pausePlaying() {
        return await this._put('/me/player/pause');
    } 

    async previousTrack() {
        return await this._post('/me/player/previous');
    }

    async nextTrack() {
        return await this._post('/me/player/next');
    }
}

export { SpotifyMusicPlayer }