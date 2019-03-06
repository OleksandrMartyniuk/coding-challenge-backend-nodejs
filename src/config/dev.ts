import { Config } from './'

export const devConfig: Config = {
    db: {
        username: 'app',
        password: 'p@ssw0rd',
        host: '127.0.0.1',
        port: 3306,
        database: 'bikes_db'
    },
    api: {
        port: 4001
    },
    logging: 'console'
}
