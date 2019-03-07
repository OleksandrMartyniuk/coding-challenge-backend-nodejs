import { Sequelize } from 'sequelize-typescript';
import { config } from './config';
import logger from './logging';

export async function initDatabaseConnection(sync = false) {
    const sequelize = new Sequelize({
        dialect: 'mysql',
        port: config.db.port,
        database: config.db.database,
        username: config.db.username,
        password: config.db.password,
        host: config.db.host,
        logging: false,
        operatorsAliases: false,
        modelPaths: [__dirname + '/model']
    });

    await sequelize.authenticate();
    logger.log(`Connected to ${config.db.database}`)
    if (sync && !config.production) {
        await sequelize.sync({ force: true });
        logger.log('Sync complete')
    }
    return sequelize;
}
