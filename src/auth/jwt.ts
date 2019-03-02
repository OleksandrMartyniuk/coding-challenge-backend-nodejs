import User from '@model/user';
import { config } from '@config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserCategory } from '../model/user';

const tokenPrefix = 'Bearer ';

function getToken(req: Request) {
    const token: string | undefined = req.headers.authorization;
    return token && token.slice(tokenPrefix.length);
}

export function getAccessToken(id: number) {
    const token = jwt.sign(id.toString(), config.security.jwtSecret);
    return tokenPrefix + token;
}

export async function validateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = getToken(req);
    if (!token) {
        next({ status: 401, message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.security.jwtSecret);
        const user = await User.findByPk(<string>decoded);
        if (user) {
            req.user = user;
            next();
        } else {
            next({ status: 401, message: 'Unauthorized' });
        }
    } catch (err) {
        next({ status: 401, message: 'Unauthorized' });
    }
}

export function verifyAccess(categories: UserCategory[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            return next({ status: 500, message: 'No user provided'});
        } else if (!categories.includes(user.category)) {
            return next({ status: 403, message: 'Forbidden'});            
        } else {
            return next();
        }
    }
}
