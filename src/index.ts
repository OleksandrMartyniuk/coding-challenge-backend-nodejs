import express from 'express';
import { initDatabaseConnection } from './db';
import { config } from './config';
import { Server } from 'http';
import registerRoutes from './routes/index';
import logger from './logging/index';
import { useConfig } from './config/index';
import bodyParser = require('body-parser');

export const app = express();
const port = config.api.port;

app.use(bodyParser.json());

registerRoutes(app);

app.all('*', (req, res, next) => {
    next({ status: 404, message: 'Not found' })
});

app.use((err: any, req: any, res: any, next: any) => {
    logger.error(err);
    res.status(err.status || 500)
        .json({ message: err.message || 'something went wrong' });
});

const server: Server = app.listen(port, () => {
    logger.log(`App is listening on port ${port}`)
});

export const start = (async () => {
    const sync = process.env['DB_SYNC'];
    const ENV = process.env['ENV'];

    if (ENV) {
        useConfig(ENV);
    }

    return await initDatabaseConnection(!!sync);
})();

export const stop = () => {
    server && server.close();
}
