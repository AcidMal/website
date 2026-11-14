/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_TWITTER_USERNAME: string;
    readonly PUBLIC_INSTAGRAM_USERNAME: string;
    readonly PUBLIC_DISCORD_ID: string;
    readonly PUBLIC_GITHUB_USERNAME: string;
    readonly PUBLIC_STEAM_ID: string;
    readonly PUBLIC_WEB3FORMS_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}