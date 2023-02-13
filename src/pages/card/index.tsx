import { MusicGenre } from '@/types/types';
import { useRouter } from 'next/router';
import { MUSIC_GENRES } from '@/helpers/constants';
import Cards from '@/components/Cards';
import styles from './index.module.css';


export default function Card() {
    const router = useRouter();
    const { genre: mainGenre } = router.query as { genre: MusicGenre };

    const subGenres = MUSIC_GENRES[mainGenre] || MUSIC_GENRES['rock'];

    if (!router.isReady) {
        return <></>
    }
        
    return (
        <div className={styles['container']}>
            <Cards
                genres={subGenres}
                main={false}
            />
            <button 
                className={styles['back-button']}
                onClick={() => router.push('/')}
            >
                Back
            </button>
            <div className={styles['container-bottom']} />
        </div>
    );
}
        