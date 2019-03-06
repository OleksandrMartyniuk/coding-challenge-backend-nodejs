import { Express, Request, Response, NextFunction, Router } from 'express';
import { wrap } from '../util/wrap';
import Officer from '../model/officer';
import Bike from '../model/bikes';

export default function registerRoutes(app: Express) {

    const router = Router();

    app.use('/officer/', router);

    router.get('/bikes/search', wrap(async (req: Request, res: Response, next: NextFunction) => {
        return res.json(await Bike.search(req.query));
    }));

    router.get('/:officerId', wrap(async (req: Request, res: Response, next: NextFunction) => {
        return await Officer.useScope('withCase').findByPk(req.params.officerId)
            .then(officer => res.json(officer));
    }));

    router.post('/:officerId/resolve', wrap(async (req: Request, res: Response, next: NextFunction) => {
        const officer = await Officer.findByPk(req.params.officerId);
        if (!officer) {
            return res.status(404).json({ message: 'Officer not found' });
        }
        await officer.resolveCurrentCase();
        const updated =  await Officer.useScope('withCase').findByPk(req.params.officerId);
        res.json(updated);
    }));
}