import { genreSchema } from '@/requests';
import Ajv from 'ajv';
import { Session } from '@/types';
import { badRequest, ok, methodNotAllowed } from '@/utils/communication-utils';
import { SpotifyMusicPlayer } from '@/clients/spotify';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method !== 'POST') {
      methodNotAllowed(res);
    }

    new Ajv().validate(genreSchema, req.body);

    const session: Session | null = await getSession({ req });
    const player = new SpotifyMusicPlayer(session?.token?.accessToken!);

    let result;
    try {
      result = await player.searchTrackByGenre(req.body.genre);
    } catch (error) {
      console.log(error)
      return badRequest(res);
    }
    ok(res, result.data);
  }