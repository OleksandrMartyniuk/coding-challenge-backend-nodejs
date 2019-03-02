import express from 'express';
import { wrap } from './../util/wrap';
import { createUser, login } from '../services/user';

export default function registerRoutes(app: express.Express) {

    app.post('/signup', wrap((req, res, next) => {
        return createUser(req.body)
            .then((user) => res.json(user));
    }));

    app.post('/login', (req, res, next) => {
        login(req.body.email, req.body.password)
            .then(user => res.json(user))
            .catch(err => res.json(err));
    });
}