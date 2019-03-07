let logger: Logger;

switch (process.env['LOGGER']) {
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