import { MUSIC_GENRES } from '@/constants';
import { ISODateString } from "next-auth";

export interface Session {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    expires: ISODateString;
    token?: JWT;
    error?: string;
} 

export interface JWT {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
    id?: any;
    expiresAt?: number;
    accessToken?: string;
    
    [x: string]: unknown;
}

export interface Genre {
    name: string;
    subGenres: string[];
}

export type MusicGenre = keyof typeof MUSIC_GENRES;
