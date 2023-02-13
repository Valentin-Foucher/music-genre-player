import { signIn } from 'next-auth/react';
import styles from './Login.module.css';
import Spotify from '@/assets/images/spotify.svg';

export default function Login() {
    return (
        <>
            <button 
                className={styles['sign-in-button']}
                onClick={() => signIn('spotify')}
            >
                <Spotify />
            </button>
            <div className={styles['sign-in-text']}>
                Sign in
            </div>
        </>
    )
}


