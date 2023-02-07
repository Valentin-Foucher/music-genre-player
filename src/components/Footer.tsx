import { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import { formatMillis } from '@/utils/time-utils';
import Image from 'next/image';
import ButtonHeart from '@/assets/images/button-heart.svg';
import PressedButtonHeart from '@/assets/images/pressed-button-heart.svg';
import UnknownArtist from '@/assets/images/unknown-artist.svg';
import axios from 'axios';



export default function Footer({ currentlyPlayingData, genre, updateCurrentSong }: { currentlyPlayingData: any, genre?: string, updateCurrentSong: () => void }) {
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [previewImageUrl, setPreviewImageUrl] = useState();
    const [updatingFavorites, setUpdatingFavorites] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState(false);
    
    const songData = currentlyPlayingData?.item;
    
    const toggleFavorites = () => {
        setUpdatingFavorites(true);
    }
    
    const resetPlayerToCurrentSong = () => {
        setCurrentTime(0);
        setDuration(0);
        updateCurrentSong();
    }
    
    useEffect(() => {
        window.addEventListener('focus', resetPlayerToCurrentSong);
        return () => {
            window.removeEventListener('focus', resetPlayerToCurrentSong);
        };
    });

    useEffect(() => {
        if (updatingFavorites) {
            if (!isFavorite) {
                axios
                .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/favorites/${songData.id}`)
                .then(_ => setUpdatingFavorites(false));
            } else {
                axios
                .delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/favorites/${songData.id}`)
                .then(_ => setUpdatingFavorites(false));
            }
            setIsFavorite(!isFavorite);
        }
    }, [updatingFavorites]);
    
    useEffect(() => {
        if (songData) {
            setDuration(songData.duration_ms);
            if (songData?.album?.images.length > 0) {
                setPreviewImageUrl(songData.album.images.find((i: { height: number, url: string }) => i.height === 64)?.url);
            }

            axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/favorites/${songData.id}/check`)
            .then(res => setIsFavorite(res.data[0]));
            
            let t = currentlyPlayingData.progress_ms;
            
            if (currentlyPlayingData.is_playing) {
                const interval = setInterval(() => {
                    t += 1000;
                    if (t >= duration) {
                        resetPlayerToCurrentSong();
                    } else {
                        setCurrentTime(t);
                    }
                }, 1000);
                return () => clearInterval(interval);
            }
        }
    }, [currentlyPlayingData]);
    
    useEffect(() => {
        if (songData) {
            setDuration(songData.duration_ms);
            const interval = setInterval(() => {
                setCurrentTime(currentTime + 1000);
            }, 1000);
            
            return () => clearInterval(interval);
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
                            onClick={toggleFavorites}
                            disabled={updatingFavorites}
                        >
                            {isFavorite 
                            ? <PressedButtonHeart /> 
                            : <ButtonHeart />}
                            
                        </button>
                    </div>
                    
                    <div className={styles['sound-bar']}>
                        {duration !== 0 && currentTime !== 0 && 
                            <>
                                {formatMillis(currentTime)} - {formatMillis(duration)}
                            </>
                        }   
                    </div>   
                <div />  
            </>       
        }    
        </footer>
    );
}