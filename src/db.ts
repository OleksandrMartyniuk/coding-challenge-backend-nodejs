import { Sequelize } from 'sequelize-typescript';
import { config } from './config';

export async function initDatabaseConnection(sync = false) {
    const sequelize = new Sequelize({
        dialect: 'mysql',
        port: config.db.port,
        database: config.db.database,
        username: config.db.username,
        password: config.db.password,
        logging: false,
        operatorsAliases: false,
        modelPaths: [__dirname + '/model']
    });

    await sequelize.authenticate();
    console.log(`Connected to ${config.db.database}`)
    if (sync) {
        await sequelize.sync({ force: true });
        console.log('Sync complete')
    }
    return sequelize;
}
