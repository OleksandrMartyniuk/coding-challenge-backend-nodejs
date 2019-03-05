import { Express } from 'express';
import adminRoutes from './admin.route';
import officerRoutes from './officer.route';
import ownerRoutes from './owner.route';

export default function registerRoutes(app: Express) {
    adminRoutes(app);
    officerRoutes(app);
    ownerRoutes(app);
}