import { Express, Request, Response, NextFunction, Router } from 'express';
import { wrap } from '../util/wrap';
import { getUserId } from '../util/user';
import Bike from '../model/bikes';
import Owner from '../model/owners';

export default function registerRoutes(app: Express) {

    const router = Router();
    
    app.use('/public', router);

    router.post('/register', wrap(async(req: Request, res: Response, next: NextFunction) => {
        const owner = await Owner.create(req.body);
        return res.json(owner);
    }))

    router.post('/report', wrap(async (req: Request, res: Response, next: NextFunction) => {
        const userId = getUserId(req);
        const model = Object.assign({}, req.body, { ownerId: userId });
        return Bike.create(model).then(bike => res.json(bike));
    }));

    router.get('/status', wrap(async (req: Request, res: Response, next: NextFunction) => {
        const userId = getUserId(req);
        return Bike.findByUserId(userId).then(bike => res.json(bike));
    }));
}