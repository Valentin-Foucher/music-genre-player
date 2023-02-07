import { Session } from '@/types/types';
import { badRequest, ok, methodNotAllowed } from '@/helpers/communication';
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
      result = await player.getDevices();
    } catch (error) {
      console.log(error)
      return badRequest(res);
    }
    ok(res, result.data);
  }