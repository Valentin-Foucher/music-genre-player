import { getNewGradientCssRule } from '@/utils/color-utils';
import styles from './index.module.css';
import { MAIN_MUSIC_GENRES } from '@/helpers/constants';
import { getTimestamp } from '@/utils/time-utils';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SoundBar from '@/components/SoundBar';
import Header from '@/components/Header';
import { Session } from '@/types/types';
import Login from '@/components/Login';


export default function Home() {
    const { data: session, status }: { data: Session | null, status: string } = useSession();
    const [genre, setGenre] = useState<string>();
    const [backgrounds, setBackgrounds] = useState<string[]>();
    
    if (status === 'unauthenticated') {
        signIn('spotify');
    }
    
    useEffect(() => {
        if (session?.token?.expiresAt! < getTimestamp() || session?.error === 'RefreshAccessTokenError') {
            signIn('spotify');
            return;
        }
        
        setBackgrounds(MAIN_MUSIC_GENRES.map(_ => getNewGradientCssRule()));
    }, []);
    
    if (!(session && session.token)) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <Login />
                </div>
            </>
        );
    }
        
    const genreCards = MAIN_MUSIC_GENRES.map((g, i) => {
        const style = backgrounds ? { background: backgrounds[i] } : {};
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
            <SoundBar genre={genre} />
        </>
    );
}
        