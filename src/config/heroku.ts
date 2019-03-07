import { Config } from '.'

export const herokuConfig: Config = {
    production: true,
    db: {
        username: 'b6304d165c6862',
        password: '856ed0f5',
        host: 'eu-cdbr-west-02.cleardb.net',
        port: 3306,
        database: 'bikes_db'
    },
    api: {
        port: 4001
    },
    logging: 'console'
}