import { useEffect, useState } from 'react';
import styles from './SoundBar.module.css';
import Image from 'next/image';
import ButtonHeart from '@/assets/images/button-heart.svg';
import PressedButtonHeart from '@/assets/images/pressed-button-heart.svg';
import UnknownArtist from '@/assets/images/unknown-artist.svg';
import PlayButton from '@/assets/images/play-button.svg';
import PauseIcon from '@/assets/images/pause-icon.svg';
import PreviousIcon from '@/assets/images/previous-icon.svg';
import NextIcon from '@/assets/images/next-icon.svg';
import { ApiClient } from '@/clients/api';
import ProgressBar from './ProgressBar';


export default function SoundBar({ genre }: { genre?: string }) {
    const [tracks, setTracks] = useState<string[]>();
    const [device, setDevice] = useState<{ id: string, active: boolean }>();
    const [currentlyPlayingData, setCurrentlyPlayingData] = useState<{[k: string]: any} | null>();
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [previewImageUrl, setPreviewImageUrl] = useState<string>();
    const [updatingFavorites, setUpdatingFavorites] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    
    const songData = currentlyPlayingData?.item;
    const apiClient = new ApiClient();
    
    const updateCurrentSong = () => {
        apiClient.updateCurrentSong(res => setCurrentlyPlayingData(res.data));
    }

    const resetPlayerToCurrentSong = () => {
        setCurrentTime(0);
        setDuration(0);
        updateCurrentSong();
    }

    const isPlaying = () => {
        return currentlyPlayingData && currentlyPlayingData.is_playing;
    }

    useEffect(() => {
        window.addEventListener('focus', resetPlayerToCurrentSong);
        return () => {
            window.removeEventListener('focus', resetPlayerToCurrentSong);
        };
    });

    useEffect(() => {
        updateCurrentSong();
    }, []);

    useEffect(() => {
        if (genre) {
            setCurrentlyPlayingData(null);

            apiClient.searchTrackByGenre(genre, res => setTracks(res.data.tracks.items.map((t: { id: string }) => t.id)));
            apiClient.getDevices(res => { 

                const smartphoneDevices = [];
                let selectedDevice;
                const devices = res.data.devices;
                
                if (!devices) {
                    return;
                }
                
                for (const d of devices) {
                    if (d.is_active) {
                        selectedDevice = { id: d.id, active: true };
                        break;
                    }
                    if (d.type === 'smartphone') {
                        smartphoneDevices.push({ id: d.id, active: false });
                    }
                }
                
                if (!selectedDevice) {
                    if (smartphoneDevices.length > 0) {
                        selectedDevice = smartphoneDevices[0];
                    } else {
                        const { id, is_active: active } = devices[0];
                        selectedDevice = { id, active };
                    }
                }
                setDevice(selectedDevice);
            });
        }
    }, [genre]);

    useEffect(() => {
        if (device && device.active === false) {
            apiClient.setPlayer(
                device.id,
                _ => setDevice({...device, active: true})
            );
            return;
        }
        
        if (device && tracks) {
            apiClient.playTracks(
                tracks,
                _ => setTimeout(() => updateCurrentSong(), 700)
            );
        }      
    }, [tracks, device]);

    useEffect(() => {
        if (updatingFavorites) {
            if (!isFavorite) {
                apiClient.addToFavorites(songData.id, _ => setUpdatingFavorites(false)); 
            } else {
                apiClient.removeFromFavorites(songData.id, _ => setUpdatingFavorites(false));
            }
            setIsFavorite(!isFavorite);
        }
    }, [updatingFavorites]);
    
    useEffect(() => {
        if (songData) {
            setDuration(songData.duration_ms);
            setCurrentTime(currentlyPlayingData.progress_ms);
            if (songData?.album?.images.length > 0) {
                setPreviewImageUrl(songData.album.images.find((i: { height: number, url: string }) => i.height === 64)?.url);
            }

            apiClient.checkInFavorites(songData.id, res => setIsFavorite(res.data[0]));
        }
    }, [currentlyPlayingData]);

    useEffect(() => {
        if (isPlaying()) {
            const interval = setInterval(() => setCurrentTime((currentTime) => currentTime + 1000), 1000);
            return () => clearInterval(interval);
        }
    }, [duration]);

    useEffect(() => {
        if (currentTime >= duration) {
            resetPlayerToCurrentSong();
        } else if (!isPlaying()) {
            setDuration(0);
        }
    }, [currentTime]);

    return (
        <footer className={styles.footer}>
            {songData &&
                <>
                    <div className={styles['current-song-details']}>
                        {previewImageUrl 
                            ? <Image
                                  src={previewImageUrl} 
                                  width='64'
                                  height='64'
                                  alt=''
                              />
                            : <UnknownArtist />
                        }
                        <div className={styles['current-song']}>
                            <div className={styles['song-name']}>
                                {songData.name}
                            </div>
                            <div className={styles['main-artist']}>
                                {songData.artists[0].name}
                            </div>
                            <div className={styles['song-genre']}>
                                {genre}
                            </div> 
                    
                        </div>                    
                        <button 
                            className={styles['button-heart']}
                            role='switch'
                            aria-checked={isFavorite}
                            aria-label='Save to Your Library'
                            onClick={_ => setUpdatingFavorites(true)}
                            disabled={updatingFavorites}
                        >
                            {isFavorite 
                            ? <PressedButtonHeart /> 
                            : <ButtonHeart />}
                            
                        </button>
                    </div>
                    
                    <div className={styles['sound-bar']}>
                        <div className={styles['sound-bar-buttons']}>
                            <button
                                className={styles['previous-next-button']}
                                onClick={() => apiClient.previousTrack(updateCurrentSong)}
                            >
                                <PreviousIcon />
                            </button>
                            <button 
                                className={styles['play-button']}
                                onClick={() => {
                                    if (isPlaying()) {
                                        apiClient.pausePlaying(updateCurrentSong);
                                    } else {
                                        apiClient.startPlaying(updateCurrentSong);
                                    }
                                }}
                            >
                                {isPlaying() ? <PauseIcon /> : <PlayButton />}

                            </button>
                            <button
                                className={styles['previous-next-button']}
                                onClick={() => apiClient.nextTrack(updateCurrentSong)}
                            >
                                <NextIcon />
                            </button>
                        </div>
                        <ProgressBar
                            duration={duration}
                            currentTime={currentTime}
                        />
                    </div>   
                <div />  
            </>       
        }    
        </footer>
    );
}