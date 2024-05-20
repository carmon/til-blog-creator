import { VercelResponse } from "@vercel/node";

import createOAuthApp from '../github/create-oauth.js';

import createdView from '../views/created.js';
import failedView from '../views/failed.js';

export default async (
  oauthId: string, 
  oauthSecret: string, 
  code: string, 
  repoName: string, 
  title: string,
  res: VercelResponse) => {
  const github = await createOAuthApp(
    oauthId,
    oauthSecret,
    code, 
  );
  const created = await github.generateBlogRepo(repoName, title);
  const owner = await github.getOwner();              
  res.writeHead(200);

  res.end(created ? createdView(owner, repoName) : failedView(repoName));
}