import { Express, Request, Response, NextFunction, Router } from 'express';
import { wrap } from '../util/wrap';
import Department from '../model/departments';
import Officer from '../model/officer';

export default function registerRoutes(app: Express) {

    const router = Router();

    app.use('/admin/', router);

    router.get('/department', wrap((req: Request, res: Response, next: NextFunction) => {
        return Department.scope('withOfficers').findAll().then(deps => res.json(deps));
    }));

    router.post('/department', wrap((req: Request, res: Response, next: NextFunction) => {
        return Department.create(req.body, { include: [Officer] }).then(dep => res.json(dep));
    }));

    router.post('/department/:id/officers', wrap(async (req: Request, res: Response, next: NextFunction) => {
        return Officer.createOfficersForDepartment(req.params.id, req.body).then(officers => res.json(officers));
    }));

    router.put('/department/:id/officers', wrap((req: Request, res: Response, next: NextFunction) => {
        return Officer.moveOfficersToDepartment(req.params.id, req.body).then(officers => res.json(officers));
    }));
}