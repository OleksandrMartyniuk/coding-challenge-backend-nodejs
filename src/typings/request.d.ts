import { Request } from 'express';
import User from '../model/user';
import { Sequelize } from 'sequelize-typescript';

declare global {
    namespace Express {
        export interface Request {
            user?: User
        }
    }
}