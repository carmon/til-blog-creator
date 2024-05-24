import { request } from '@octokit/request';

import { GithubOAuthService } from '../types.js';

const getUserToken = async (client_id: string, client_secret: string, code: string) => {
  const res = await request(
    `POST https://github.com/login/oauth/access_token`, 
    { 
      data: { 
        client_id,
        client_secret,
        code
      }
    }) as any;
  return res.data.access_token;
};

export default async (
    clientId: string,
    clientSecret: string,
    code: string
  ): Promise<GithubOAuthService> => {
    const userToken = await getUserToken(clientId, clientSecret, code);

    const getOwner = async () => {
      const { data: { login: owner } } = await request(
        `GET https://api.github.com/user`,
        {
          headers: {
            authorization: `bearer ${userToken}`
          }
        }
      )
      return owner;
    };
    return {
      generateBlogRepo: async (name: string, title: string) => {
        try {
          const { status } = await request(
            `POST /repos/carmon/til-template/generate`,
            {
              headers: {
                Accept: 'application/vnd.github.baptiste-preview+json', // needed while endpoint is still in preview
                authorization: `bearer ${userToken}`
              }, 
              data: {
                name,
                description: `${title}: A static blog created with til-blog-creator.`
              }
            }
          );
          const success = status === 201;
          // if (success) {
          //   const owner = await getOwner();
          //   const { data } = await request(
          //     `GET /repos/${owner}/${name}/contents/README.md`,
          //     {
          //       headers: {
          //         authorization: `bearer ${userToken}`,
          //         accept: 'application/vnd.github+json',
          //       }
          //     }
          //   )
          //   console.log(data);
          // }
          return success;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
      configBlogRepo: async (name, title) => {
        const owner = await getOwner();
        const filePath = `/repos/${owner}/${name}/contents/README.md`;
        const { data: { content } } = await request(
          `GET ${filePath}`,
          {
            headers: {
              authorization: `bearer ${userToken}`,
              accept: 'application/vnd.github+json',
            }
          }
        )
        const md = Buffer.from(content, 'base64').toString('utf-8');
        const updatedMd = md.replace('til-template', title);
        const result = await request(
          `PUT ${filePath}`,
          {
            content: Buffer.from(updatedMd).toString('base64'),
            headers: {
              authorization: `bearer ${userToken}`,
            }
          }
        )
        console.log(result);
        return 'true';
      },
      getOwner,
    };
  };