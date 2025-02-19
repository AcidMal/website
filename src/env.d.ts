/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_TWITTER_USERNAME: string;
    readonly TWITTER_BEARER_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}