import { MAIN_MUSIC_GENRES } from '@/helpers/constants';
import { signIn, useSession } from 'next-auth/react';
import Header from '@/components/Header';
import { Session } from '@/types/types';
import Login from '@/components/Login';
import Cards from '@/components/Cards';
import styles from './index.module.css';


export default function Home() {
    const { data: session, status }: { data: Session | null, status: string } = useSession();
    
    if (status === 'unauthenticated') {
        signIn('spotify');
    }
    
    if (!(session && session.token)) {
        return (
            <>
                <Header />
                <div>
                    <Login />
                </div>
            </>
        );
    }

    return (
        <div className='container'>
            <Cards
                genres={MAIN_MUSIC_GENRES}
                main={true}
            />
            <div className={styles['container-bottom']} />
        </div>
    );
}
        