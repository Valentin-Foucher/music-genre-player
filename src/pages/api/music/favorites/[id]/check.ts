import { Session } from '@/types/types';
import { badRequest, methodNotAllowed, noReply, ok } from '@/helpers/communication';
import { SpotifyMusicPlayer } from '@/clients/music';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method !== 'GET') {
      methodNotAllowed(res);
    } 

    const session = await getSession({ req });

    const player = new SpotifyMusicPlayer((session as Session).token?.accessToken!);

    let result;
    try {
        result = await player.checkInFavorites(req.query.id as string);
    } catch (error) {
        console.log(error)
        return badRequest(res);
    }
    ok(res, result.data);
  }