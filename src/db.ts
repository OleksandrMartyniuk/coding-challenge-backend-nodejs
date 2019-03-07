import { Sequelize } from 'sequelize-typescript';
import logger from './logging';

export async function initDatabaseConnection() {
    const sequelize = new Sequelize({
        dialect: 'mysql',
        port: parseInt(process.env['DB_PORT']) || 3306,
        database: process.env['DB_DATABASE'],
        username: process.env['DB_USER'],
        password: process.env['DB_PASSWORD'],
        host: process.env['DB_HOST'],
        logging: false,
        operatorsAliases: false,
        modelPaths: [__dirname + '/model']
    });

    await sequelize.authenticate();
    logger.log(`Connected to ${process.env['DB_DATABASE']}`)
    await sequelize.sync({ force: process.env['FORCE_SYNC'] === 'true' });
    logger.log('Sync complete')
    return sequelize;
}
