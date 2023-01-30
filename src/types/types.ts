import { MAIN_MUSIC_GENRES } from '@/helpers/constants';
import { ISODateString } from "next-auth";

export interface Session {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    expires: ISODateString;
    token?: JWT;
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

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType>
  ? ElementType
  : never


export type MusicGenre = ElementType<typeof MAIN_MUSIC_GENRES>;

export type PlayableCategory = 'track' | 'album' | 'playlist';