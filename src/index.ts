import * as http from 'http';
import config from 'dos-config';

import createOAuthApp from './github/create-oauth';
import authView from './views/authentication';
import formView from './views/form';
import createdView from './views/created';
import failedView from './views/failed';

const port = config.port || 8000;
http
  .createServer((req, res) => 
    {
      let data = '';
      req
        .on('data', chunk => { data += chunk; })
        .on('end', async () => {
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
            const match = req.url.match(/\/create\?code=([\w.-]+)&name=([\w\@.-]+)/);
            if(match) {
              const [, code, name] = match;
              const github = await createOAuthApp(
                config.oauthApp.clientId,
                config.oauthApp.clientSecret,
                code, 
              );
              const created = await github.generateBlogRepo(name);
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
    () => { console.log(`Server listening on port ${port}`); }
  );