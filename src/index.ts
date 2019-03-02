import 'module-alias/register';
import express from 'express';
import { initDatabaseConnection } from './db';
import { config } from '@config';
import { Server } from 'http';
import registerAuthRoutes from './routes/auth';
import bodyParser = require('body-parser');

export const app = express();
const port = config.api.port;

app.use(bodyParser.json());

registerAuthRoutes(app);

app.get('*', (req,res,next) => {
    next({ status: 404, message: 'Not found'})
});

const server: Server = app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});

export const start = (async () => {
    await initDatabaseConnection(false);
})();

export const stop = () => {
    server && server.close();
}
