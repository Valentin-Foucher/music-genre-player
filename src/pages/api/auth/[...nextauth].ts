import { Session, JWT } from '@/types';
import NextAuth, { Account } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

export default NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_ID!,
            clientSecret: process.env.SPOTIFY_SECRET!,
            authorization: { params: { scope: 'user-modify-playback-state user-read-playback-state user-read-currently-playing user-library-read user-library-modify' } },
        }),
    ],
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
        async jwt({ token, account }: { token: JWT, account?: Account | null}): Promise<JWT> {
            if (account) {
              token.id = account.id;
              token.expiresAt = account.expires_at;
              token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            session.token = token;
            return session;
        },
    }
});