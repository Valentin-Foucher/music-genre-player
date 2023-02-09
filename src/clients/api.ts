import { MusicGenre } from '@//types/types';
import BaseClient from "@/clients/base";

class ApiClient extends BaseClient {
    constructor() {
        super(process.env.NEXT_PUBLIC_BACKEND_URL!);
    }
    

    searchTrackByGenre(genre: MusicGenre, callback: (value: any) => void) {
        this
        ._post('/music/search-tracks', { genre })
        .then(callback);
    }
    
    getDevices(callback: (value: any) => void) {
        this
        ._get('/music/devices')
        .then(callback);
    }

    getPlaylists() {
        //return await this._get('/me/playlists');
    }

    setPlayer(deviceId: string, callback: (value: any) => void) {
        this
        ._post('/music/set-player', { deviceId })
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

    }

    playTracks(trackIds: string[], callback: (value: any) => void) {
        this
        ._post('/music/play', { trackIds })
        .then(callback);
    }

    updateCurrentSong(callback: (value: any) => void) {
        this
        ._get('/music/currently-playing')
        .then(callback)
        .catch(_ => {});
    }

}

export { ApiClient }