import User, { UserCategory } from '../model/user';
import { hashPassword, comparePasswords } from '../auth/hash';
import { getAccessToken } from '../auth/jwt';

export async function createUser(user: User, category: UserCategory = 'issuer'): Promise<Partial<User>> {
    user.category = category;
    const hash = await hashPassword(user.password);
    user.password = hash;
    const created = await User.create(user, { raw: true });
    return { id: created.id, category };
}

export async function login(email: string, password: string) {
    const user = await User.findOne({ where: { email }, attributes: ['password', 'category', 'id'] });
    if (!user) {
        throw { message: 'wrong email' };
    }
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
        throw { message: 'wrong password' };
    } else {
        return { email, category: user.category, token: getAccessToken(user.id) };
    }
}