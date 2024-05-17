import { VercelRequest, VercelResponse } from '@vercel/node';
import config from 'dos-config';

import resolveCreate from '../src/routes/create.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.url?.includes('/create')) {
    const match = req.url.match(/\/create\?code=([\w.-]+)&name=([\w\@.-]+)/);
    if (match) {
      const [, code, repoName] = match;
      return await resolveCreate(
        config.oauthApp.clientId,
        config.oauthApp.clientSecret,
        code,
        repoName,
        res
      );
    }
  }
  res.end();
}