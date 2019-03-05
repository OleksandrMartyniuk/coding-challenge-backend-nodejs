import { Request, Response, NextFunction, Handler } from 'express';

interface WrapOptions {
    forceStatus?: number;
    forceMessage?: string;
}

export function wrap(handler: Handler, options?: WrapOptions): Handler {
    return async function (req: Request, res: Response, next: NextFunction) {
        return Promise.resolve(handler(req, res, next)).catch(err => {
            console.error(err);
            const originalMessage = err.original && err.original.message ? err.original.message : null;
            const message = [err.message, originalMessage].join(': ');
            if (options) {
                next({
                    status: options.forceStatus || err.status,
                    message: options.forceMessage == null ? message : options.forceMessage
                });
            } else {
                next({ status: err.status, message });
            }
            return null;
        });
    };
}