import { signIn } from 'next-auth/react';
import BaseClient from "@/clients/base";

class ApiClient extends BaseClient {
    constructor() {
        super(process.env.NEXT_PUBLIC_BACKEND_URL!);
    }
    
    searchTrackByGenre(genre: string, callback: (value: any) => void) {
        this
        ._post('/music/search-tracks', { genre })
        .then(callback);
    }
    
    getDevices(callback: (value: any) => void) {
        this
        ._get('/music/devices')
        .then(callback);
    }

    setPlayer(deviceId: string, callback: (value: any) => void) {
        this
        ._post('/music/player/set', { deviceId })
        .then(callback);
    }

    removeFromFavorites(songDataId: string, callback: (value: any) => void) {
        this
        ._delete(`/music/favorites/${songDataId}`)
        .then(callback);
    }

    addToFavorites(songDataId: string, callback: (value: any) => void) {
        this
        ._put(`/music/favorites/${songDataId}`)
        .then(callback);
    }

    checkInFavorites(songDataId: string, callback: (value: any) => void) {
        this
        ._get(`/music/favorites/${songDataId}/check`)
        .then(callback);
    }

    playTracks(trackIds: string[], callback: (value: any) => void) {
        this
        ._post('/music/player/play-tracks', { trackIds })
        .then(callback);
    }

    startPlaying(callback: (value: any) => void) {
        this
        ._post('/music/player/play-tracks')
        .then(callback);
    }

    pausePlaying(callback: (value: any) => void) {
        this
        ._post('/music/player/pause')
        .then(callback);
    }

    previousTrack(callback: (value: any) => void) {
        this
        ._post('/music/player/previous')
        .then(callback);
    }

    nextTrack(callback: (value: any) => void) {
        this
        ._post('/music/player/next')
        .then(callback);
    }

    updateCurrentSong(callback: (value: any) => void) {
        this
        ._get('/music/player/currently-playing')
        .then(callback)
        .catch(error => { signIn('spotify') });
    }

}

export { ApiClient }