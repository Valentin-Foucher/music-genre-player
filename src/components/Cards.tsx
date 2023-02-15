import styles from './Cards.module.css';
import SoundBar from '@/components/SoundBar';
import Header from '@/components/Header';
import { shouldSignIn } from '@/utils/oauth-utils';
import { Session } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getNewGradientCssRule } from '@/utils/color-utils';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PlayIcon from '@/assets/images/play-icon.svg';
import Categories from '@/assets/images/categories.svg';


export default function Cards({ genres, main }: { genres: string[], main: boolean }) {
    const { data: session }: { data: Session | null } = useSession();
    const [backgrounds, setBackgrounds] = useState<string[]>();
    const [genre, setGenre] = useState<string>();
    const router = useRouter();

    useEffect(() => {
        if (shouldSignIn(session)) {
            router.push('/');
            return;
        }

        setBackgrounds(genres.map(_ => getNewGradientCssRule()));
    }, []);

    const genreCards = genres.map((g, i) => {
        const cardStyle = backgrounds ? { background: backgrounds[i] } : {};
        return main ? (
            <div 
                key={i}
                className={styles['card']}
                style={cardStyle}
            >
                <div 
                    className={`${styles['left-card']} ${styles['half-card']} ${styles['clickable-card']}`}
                    onClick={() => setGenre(g)}
                >
                    <PlayIcon style={{ width: '44px' }} />
                    <div className={styles['overlay']} style={{ bottom: '44px' }}/>
                </div>
                <Link
                    className={`${styles['right-card']} ${styles['half-card']} ${styles['clickable-card']}`}
                    href={{
                        pathname: '/card',
                        query: { genre: g }
                    }}
                >
                    <Categories style={{ width: '32px', }} />
                    <div className={styles['overlay']} style={{ bottom: '32px' }}/>
                </Link>
                <div className={styles['card-text']}>
                    {g}
                </div>

            </div>)
        : (
        <div 
            key={i}
            className={`${styles['card']} ${styles['clickable-card']}`}
            style={cardStyle}
            onClick={() => setGenre(g)}
        >
            <div className={`${styles['left-card']} ${styles['half-card']}`}>
                <PlayIcon style={{ left: '77%', top: '55%', width: '64px' }} />
            </div>
            <div className={`${styles['right-card']} ${styles['half-card']}`} />

            <div className={styles['overlay']} />
            <div className={styles['card-text']}>
                {g}
            </div>
        </div>
        );
    });

    return (
        <>
            <Header />
            <div className={styles['cards-container']}>
                {genreCards}
            </div>
            <SoundBar genre={genre} />
            
        </>
    );
}
        