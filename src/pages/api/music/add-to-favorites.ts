import { Session } from '../../../types/types';
import { badRequest, noReply, ok } from '@/helpers/communication';
import { SpotifyMusicPlayer } from '@/clients/music'
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const session = await getSession({ req });

    const player = new SpotifyMusicPlayer((session as Session).token?.accessToken!);
    console.log((session as Session).token?.accessToken!)

    let result;
    try {
      result = await player.addToFavorites(req.body.trackId);
    } catch (error) {
      console.log(error)
      return badRequest(res);
    }
    noReply(res);
  }