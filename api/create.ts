import { VercelRequest, VercelResponse } from '@vercel/node';
import config from 'dos-config';

import getURLMatch from '../src/match.js';
import resolveCreate from '../src/routes/create.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.url?.includes('/create')) {
    const match = getURLMatch(req.url);
    if (match) {
      const [, code, repoName, title] = match;
      return await resolveCreate(
        config.oauthApp.clientId,
        config.oauthApp.clientSecret,
        code,
        repoName,
        title,
        res,
      );
    }
  }
  res.end();
}