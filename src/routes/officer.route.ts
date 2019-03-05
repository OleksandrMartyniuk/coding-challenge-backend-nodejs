import { Express, Request, Response, NextFunction, Router } from 'express';
import { wrap } from '../util/wrap';
import Officer from '../model/officer';

export default function registerRoutes(app: Express) {

    const router = Router();
    
    app.use('/officer/', router);

    router.get('/bikes/search', wrap((req: Request, res: Response, next: NextFunction) => {
        // return getDepartments().then(deps => res.json(deps));
    }));

    router.get('/:officerId', wrap((req: Request, res: Response, next: NextFunction) => {
        return Officer.useScope('withCase').findByPk(req.params.officerId)
            .then(officer => res.json(officer));
    }));

    router.post('/:officerId/resolve', wrap(async (req: Request, res: Response, next: NextFunction) => {
        const officer = await Officer.findByPk(req.params.officerId);
        if (!officer) {
            return res.status(404).json({ message: 'Officer not found' });
        }
        return officer.resolveCurrentCase().then(updated => res.json(updated));
    }));
}