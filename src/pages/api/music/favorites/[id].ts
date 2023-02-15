import { Session } from '@/types';
import { badRequest, methodNotAllowed, noReply } from '@/utils/communication-utils';
import { SpotifyMusicPlayer } from '@/clients/spotify';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method == 'PUT') {
        const session = await getSession({ req });

        const player = new SpotifyMusicPlayer((session as Session).token?.accessToken!);
    
        let result;
        try {
            result = await player.addToFavorites(req.query.id as string);
        } catch (error) {
            console.log(error)
            return badRequest(res);
        }
        noReply(res);
    } else if (req.method == 'DELETE') {
        const session = await getSession({ req });

        const player = new SpotifyMusicPlayer((session as Session).token?.accessToken!);
    
        let result;
        try {
            result = await player.removeFromFavorites(req.query.id as string);
        } catch (error) {
            console.log(error)
        }
        noReply(res);
    } else {
      methodNotAllowed(res);
    }
  }