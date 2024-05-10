import { GithubOAuthService } from '../types';

const getUserToken = async (client_id: string, client_secret: string, code: string) => {
  const { request } = await import('@octokit/request'); // load ESM module dinamically
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
    const { request } = await import('@octokit/request'); // load ESM module dinamically
    const userToken = await getUserToken(clientId, clientSecret, code);
    return {
      generateBlogRepo: async (name: string) => {
        try {
          const { data, status } = await request(
            `POST /repos/carmon/til-template/generate`,
            {
              headers: {
                Accept: 'application/vnd.github.baptiste-preview+json', // needed while endpoint is still in preview
                authorization: `bearer ${userToken}`
              }, 
              data: { 
                name,
                description: 'A static blog created with til-blog-creator.'
              }
            }
          );
          console.log(data);
          return status === 201;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
      getOwner: async () => {
        const { data: { login: owner } } = await request(
          `GET https://api.github.com/user`,
          {
            headers: {
              authorization: `bearer ${userToken}`
            }
          }
        )
        return owner;
      }
    };
  };