export type GithubOAuthService = {
  generateBlogRepo: (name: string, title: string) => Promise<boolean>;
  configBlogRepo: () => Promise<string>;
  getOwner: () => Promise<string>;
};