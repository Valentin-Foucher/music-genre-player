import { formatMillis } from "@/utils/time-utils";
import styles from './ProgressBar.module.css';

export default function ProgressBar({ duration, currentTime }: { duration: number, currentTime: number }) {
    if (duration === 0 || currentTime === 0) {
        <div className={styles['progress-bar']} />
    }

    const percentListened = currentTime / duration * 100;

    return (
    <>
        <div className={styles['progress-bar']}>
            <div className={styles['duration']}>
                {formatMillis(currentTime)}
            </div>
            <div 
                className={styles['listened']} 
                style={{ width: `${percentListened}%` }}
            />
            <div 
                className={styles['not-listened']} 
                style={{ width: `${100 - percentListened}%` }}
            />
            <div className={styles['duration']}>
                {formatMillis(duration)}
            </div>
        </div>
    </>
    );
 }