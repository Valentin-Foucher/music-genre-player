import { NextApiResponse as Response } from 'next';

const makeResponse = (res: Response, code: number, data?: string | { [key: string]: any }) => {
  res.status(code);
  if (data) {
    res.json(data instanceof Object ? data : { message: data });
  } else {
    res.end();
  };
}

const ok = (res: Response, payload: { [key: string]: any } ) => {
  makeResponse(res, 200, payload);
};

const noReply = (res: Response) => {
  makeResponse(res, 204);
};

const badRequest = (res: Response, message?: string) => {
  makeResponse(res, 400, message);
};

const unauthorized = (res: Response, message?: string) => {
  makeResponse(res, 401, message);
};

const forbidden = (res: Response, message?: string) => {
  makeResponse(res, 403, message);
};

const notFound = (res: Response, message?: string) => {
  makeResponse(res, 404, message);
};

const conflict = (res: Response, message?: string) => {
  makeResponse(res, 409, message);
};

const unprocessableEntity = (res: Response, message?: string) => {
  makeResponse(res, 422, message);
};

export { ok, noReply, badRequest, unauthorized, forbidden, notFound, conflict, unprocessableEntity };