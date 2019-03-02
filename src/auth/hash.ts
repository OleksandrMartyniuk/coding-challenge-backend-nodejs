import bcrypt from 'bcrypt'
import { config } from '@config';

export function hashPassword(pwd: string): Promise<string> {
    return bcrypt.hash(pwd, config.security.saltRounds);
}

export function comparePasswords(pwd: string, hash: string): Promise<boolean> {
    return bcrypt.compare(pwd, hash);
}