declare module 'dos-config' {
    interface Config {
        oauthId: string;
        oauthSecret: string;
        port: number;
    }
    const config: Config;
    export default config;
} 