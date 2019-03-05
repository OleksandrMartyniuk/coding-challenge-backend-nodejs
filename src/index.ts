import express from 'express';
import { initDatabaseConnection } from './db';
import { config } from './config';
import { Server } from 'http';
import registerRoutes from './routes/index';
import bodyParser = require('body-parser');

export const app = express();
const port = config.api.port;

app.use(bodyParser.json());

registerRoutes(app);

app.all('*', (req, res, next) => {
    next({ status: 404, message: 'Not found' })
});

app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500)
        .json({ message: err.message || 'something went wrong' });
});

const server: Server = app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});

export const start = (async () => {
    return await initDatabaseConnection(true);
})();

export const stop = () => {
    server && server.close();
}
