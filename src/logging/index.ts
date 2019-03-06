import { config } from '../config';

let logger: Logger;

switch (config.logging) {
    default:
        logger = console;
        break;
}

export interface Logger {
    log: (...args: any[]) => void,
    error: (...args: any[]) => void
    warn: (...args: any[]) => void
}

export default logger;