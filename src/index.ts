import express from 'express';
import { initDatabaseConnection } from './db';
import { Server } from 'http';
import registerRoutes from './routes/index';
import logger from './logging/index';
import bodyParser = require('body-parser');
import dotenv from 'dotenv';

export const app = express();
const port = process.env['PORT'] || 8080;

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
    dotenv.config();

    return await initDatabaseConnection();
})();

export const stop = () => {
    server && server.close();
}
