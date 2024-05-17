import { VercelRequest, VercelResponse } from '@vercel/node';
import config from 'dos-config';

import resolveAuth from '../src/routes/auth.js';

export default (_: VercelRequest, res: VercelResponse) => 
  resolveAuth(config.oauthApp.clientId, res)