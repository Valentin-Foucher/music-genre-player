import { createRandomColor } from '@/utils/color-utils';
import styles from './index.module.css';
import { MAIN_MUSIC_GENRES } from '@/helpers/constants';
import { getTimestamp } from '@/utils/time-utils';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Spotify from '@/assets/images/spotify.svg';
import Header from '@/components/Header';

const getNewGradientCssRule = () => {
    const deg = Math.floor(Math.random() *360);
    
    return 'linear-gradient(' + deg + 'deg, ' + '#' + createRandomColor() + ', ' + '#' + createRandomColor() +')';
}


export default function Home() {
    const { data: session, status } = useSession();
    const [genre, setGenre] = useState<string>();
    const [tracks, setTracks] = useState();
    const [device, setDevice] = useState<{ id: string, active: boolean }>();
    const [backgrounds, setBackgrounds] = useState<string[]>();
    const [currentlyPlayingData, setCurrentlyPlayingData] = useState<{[k: string]: any} | null>();
    
    const updateCurrentSong = () => {
        axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/currently-playing`)
        .then(res => setCurrentlyPlayingData(res.data))
        .catch(_ => {});
    }
    
    if (status === 'unauthenticated') {
        signIn('spotify');
    }
    
    useEffect(() => {
        if ((session as any)?.token?.expiresAt < getTimestamp() || (session as any)?.error === "RefreshAccessTokenError") {
            signIn('spotify');
            return;
        }
        
        setBackgrounds(MAIN_MUSIC_GENRES.map(_ => getNewGradientCssRule()));
        updateCurrentSong();
    }, []);
    
    useEffect(() => {
        if (genre) {
            setCurrentlyPlayingData(null);

            axios
            .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/search-tracks`, { genre })
            .then(res => setTracks(res.data.tracks.items.map((t: { id: string }) => t.id)));
            
            axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/devices`).then(res => { 
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
            })
        }
    }, [genre]);
    
    useEffect(() => {
        if (device && device.active === false) {
            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/player`, { deviceId: device.id })
            .then(_ => setDevice({...device, active: true}));
            return;
        }
        
        if (device && tracks) {
            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/music/play`, { trackIds: tracks })
            .then(_ => setTimeout(() => updateCurrentSong(), 700));
        }      
    }, [tracks, device]);
    
    if (!session) {
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
                currentlyPlayingData={currentlyPlayingData}
                updateCurrentSong={updateCurrentSong}
                genre={genre}
            />
        </>
    );
}
        