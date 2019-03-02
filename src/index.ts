import 'module-alias/register';
import express from 'express';
import { initDatabaseConnection } from './db';
import { config } from '@config';
import { Server } from 'http';

export const app = express();
const port = config.api.port;

app.get('/hello', (req, res) => { res.send('World') });
    
const server: Server = app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});

export const start = (async () => {
    await initDatabaseConnection(false);
})();

export const stop = () => {
    server && server.close();
}
