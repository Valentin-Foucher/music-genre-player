import { getTimestamp } from '@/utils/time-utils';
import { Session } from '@/types'

export const shouldSignIn = (session: Session | null): boolean => {
    return session?.token?.expiresAt! < getTimestamp() 
        || session?.error === 'RefreshAccessTokenError';
}