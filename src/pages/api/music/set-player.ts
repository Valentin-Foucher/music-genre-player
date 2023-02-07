import { Session } from '@/types/types';
import { badRequest, noReply, methodNotAllowed } from '@/helpers/communication';
import { SpotifyMusicPlayer } from '@/clients/music';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method !== 'POST') {
      methodNotAllowed(res);
    }

    const session = await getSession({ req });

    const player = new SpotifyMusicPlayer((session as Session).token?.accessToken!);

    let result;
    try {
      result = await player.setPlayer(req.body.deviceId);
    } catch (error) {
      console.log(error)
      return badRequest(res);
    }
    noReply(res);
  }