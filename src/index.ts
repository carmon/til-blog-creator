import child_process from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';

import config from 'dos-config';

import createOAuthApp from './github/create-oauth.js';
import authView from './views/authentication.js';
import formView from './views/form.js';
import createdView from './views/created.js';
import failedView from './views/failed.js';

import getURLMatch from './match.js';

const port = config.port || 8000;
http
  .createServer((req, res) => 
    {
      let data = '';
      req
        .on('data', chunk => { data += chunk; })
        .on('end', async () => {
          if (req.url === '/' || req.url === '/index.html') {
            const index = fs.readFileSync('index.html');
            res.writeHead(200);
            res.end(index);
            return;
          }
          if (req.url === '/auth') {
            res.writeHead(302);
            res.end(authView(config.oauthApp.clientId));
            return;
          }

          if (req.url?.includes('/oauth')) {
            const code = req.url.split('=')[1];
            res.writeHead(200);
            res.end(formView(code))
            return;
          }

          if(req.url?.includes('/create')) {
            const match = getURLMatch(req.url);
            if(match) {
              const [, code, name, title] = match;
              const github = await createOAuthApp(
                config.oauthApp.clientId,
                config.oauthApp.clientSecret,
                code, 
              );
              const created = await github.generateBlogRepo(name, title);
              const owner = await github.getOwner();              
              res.writeHead(200);

              res.end(created ? createdView(owner, name) : failedView(name));
              return;
            }
          }
        })
        .on('error', () => { res.end({"message" : "BAD REQUEST"}); });
    }
  )
  .listen(
    port, 
    () => { 
      console.log(`Server listening on port ${port}`); 
      console.log('Opening in browser...');
      const url = `http://localhost:${port}`;
      const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
      child_process.exec(`${start} ${url}`);
    }
  );