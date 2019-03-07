import { Config } from './'

export const testConfig: Config = {
    db: {
        username: 'root',
        password: 'root',
        host: 'mysql',
        port: 3306,
        database: 'bikes_test'
    },
    api: {
        port: 4001
    },
    logging: 'console'
}
