declare module 'dos-config' {
    type OAuthApp = {
        clientId: string;
        clientSecret: string;
    };

    interface Config {
        oauthApp: OAuthApp;
        port: number;
    }
    const config: Config;
    export default config;
} 