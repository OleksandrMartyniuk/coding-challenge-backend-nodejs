import { devConfig } from './dev';

export interface Config {
    db: DbConfig,
    api: {
        port: number
    },
    security: {
        jwtSecret: string,
        saltRounds: number
    }
}

export interface DbConfig {
    username: string,
    password: string,
    host: string,
    port: number,
    database: string
}

const defaultConfig: Config = devConfig;

export let config: Config = defaultConfig;

export const useConfig = (env: 'dev' = 'dev') => {
    switch (env) {
        case 'dev':
            config = defaultConfig;
            break;
        default:
            config = defaultConfig;
            break;
    }
};
