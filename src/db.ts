import { Sequelize } from 'sequelize-typescript';
import logger from './logging';

export async function initDatabaseConnection(sync = false) {
    const sequelize = new Sequelize({
        dialect: 'mysql',
        port: parseInt(process.env['DB_PORT']) || 3306,
        database: process.env['DB_DATABASE'],
        username: process.env['DB_USER'].toString(),
        password: process.env['DB_PASSWORD'].toString(),
        host: process.env['DB_HOST'].toString(),
        logging: false,
        operatorsAliases: false,
        modelPaths: [__dirname + '/model']
    });

    await sequelize.authenticate();
    logger.log(`Connected to ${process.env['DB_DATABASE']}`)
    if (sync && process.env['ENV'] !== 'production') {
        await sequelize.sync();
        logger.log('Sync complete')
    }
    return sequelize;
}
