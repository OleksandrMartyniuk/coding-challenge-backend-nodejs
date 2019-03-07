import { devConfig } from './dev';
import { testConfig } from './test';
import { herokuConfig } from './heroku';

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
        case 'heroku':
            config = herokuConfig;
            break;
        case 'test':
            config = testConfig;
            break;
        default:
            config = defaultConfig;
            break;
    }
};
