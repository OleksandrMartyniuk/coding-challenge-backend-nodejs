import { devConfig } from './dev';
import { testConfig } from './test';

export interface Config {
    production?: boolean,
    db: DbConfig,
    api: {
        port: number
    },
    logging: 'console'
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

export const useConfig = (env: string) => {
    switch (env) {
        case 'test':
            config = testConfig;
            break;
        default:
            config = defaultConfig;
            break;
    }
};
