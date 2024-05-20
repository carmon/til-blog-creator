export type GithubOAuthService = {
  generateBlogRepo: (name: string, title: string) => Promise<boolean>;
  configBlogRepo: (title: string) => Promise<string>;
  getOwner: () => Promise<string>;
};