import { createRandomColor } from '@/utils/color-utils';
import styles from './index.module.css';
import { MAIN_MUSIC_GENRES } from '@/helpers/constants';
import { getTimestamp } from '@/utils/time-utils';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Spotify from '@/assets/images/spotify.svg';
import Header from '@/components/Header';
import { ApiClient } from '@/clients/api';
import { Session } from '@/types/types';


const getNewGradientCssRule = () => {
    const deg = Math.floor(Math.random() *360);
    
    return 'linear-gradient(' + deg + 'deg, ' + '#' + createRandomColor() + ', ' + '#' + createRandomColor() +')';
}

export default function Home({ apiClient }: { apiClient: ApiClient }) {
    const { data: session, status }: { data: Session | null, status: string } = useSession();
    const [genre, setGenre] = useState<string>();
    const [tracks, setTracks] = useState<string[]>();
    const [device, setDevice] = useState<{ id: string, active: boolean }>();
    const [backgrounds, setBackgrounds] = useState<string[]>();
    const [currentlyPlayingData, setCurrentlyPlayingData] = useState<{[k: string]: any} | null>();
    
    const updateCurrentSong = () => {
        apiClient.updateCurrentSong(res => setCurrentlyPlayingData(res.data));
    }
    
    if (status === 'unauthenticated') {
        signIn('spotify');
    }
    
    console.log(session?.token?.expiresAt!)
    console.log(getTimestamp())
    useEffect(() => {
        if (session?.token?.expiresAt! < getTimestamp() || session?.error === 'RefreshAccessTokenError') {
            signIn('spotify');
            return;
        }
        
        setBackgrounds(MAIN_MUSIC_GENRES.map(_ => getNewGradientCssRule()));
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
    
    if (!(session && session.token)) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <button 
                        className={styles['sign-in-button']}
                        onClick={() => signIn('spotify')}
                    >
                        <Spotify />
                    </button>
                    <div className={styles['sign-in-text']}>
                        Sign in
                    </div>
                </div>
            </>
        );
    }
        
    const genreCards = MAIN_MUSIC_GENRES.map((g, i) => {
        const style = backgrounds ? {background: backgrounds[i] } : {};
        return (
            <div 
                key={i}
                className={styles.card}
                style={style}
                onClick={() => setGenre(g)}
            >
                <div className={styles['card-titles']}>
                    {g}
                </div>
            </div>
            );
    });
        
    return (
        <>
            <Header />
            <div className={styles.container}>
                {genreCards}
            </div>
            <Footer 
                apiClient={apiClient}
                currentlyPlayingData={currentlyPlayingData}
                updateCurrentSong={updateCurrentSong}
                genre={genre}
            />
        </>
    );
}
        