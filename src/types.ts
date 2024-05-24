export type GithubOAuthService = {
  generateBlogRepo: (name: string, title: string) => Promise<boolean>;
  configBlogRepo: (name: string, title: string) => Promise<string>;
  getOwner: () => Promise<string>;
};