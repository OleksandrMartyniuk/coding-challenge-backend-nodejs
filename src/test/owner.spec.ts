import { start, app, stop } from '../index';
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import Bike from '../model/bikes';
import Owner from '../model/owners';
import Officer from '../model/officer';
import moment from 'moment';
import Department from '../model/departments';

chai.use(chaiHttp)

let db: any;

describe('Owner', () => {
    before(async () => {
        db = await start;
    });

    after(() => {
        stop();
    });

    beforeEach(async () => {
        await db.sync({ force: true });
    });

    it('should register', async () => {
        const res = await chai.request(app)
            .post('/public/register')
            .send({ email: 'owner@test.com' });

        expect(res.status).to.eq(200);
        expect(res.body.email).to.eql('owner@test.com');
        expect(res.body.id).to.eql(1);
    });

    it('should create a report', async () => {
        const bike: Partial<Bike> = {
            color: 'black',
            fullName: 'John Doe',
            licenseNumber: 'abcd123test',
            type: 'MTB',
            date: new Date(2019, 2, 5),
            theftDescription: 'guy in chicken suit'
        };

        const { id } = await Owner.create({ email: 'owner@test.com' });

        const res = await chai.request(app)
            .post('/public/report')
            .set('authorization', id.toString())
            .send(bike);

        expect(res.status).to.eql(200);
        expect(res.body).to.be.eql(
            Object.assign(bike,
                {
                    id: 1,
                    date: '2019-03-05',
                    ownerId: 1,
                    status: 'NEW'
                }));
    });

    it('should create a report and assign to officer', async () => {
        const bike: Partial<Bike> = {
            color: 'black',
            fullName: 'John Doe',
            licenseNumber: 'abcd123test',
            type: 'MTB',
            date: new Date('2019-03-05'),
            theftDescription: 'guy in chicken suit'
        };

        const { id: ownerId } = await Owner.create({ email: 'owner@test.com' });
        const { id: officerId } = await Officer.create({ email: 'officer1@police.com' })

        const res = await chai.request(app)
            .post('/public/report')
            .set('authorization', ownerId.toString())
            .send(bike);

        expect(res.status).to.eql(200);
        expect(res.body).to.be.eql(
            Object.assign(bike,
                {
                    id: 1,
                    date: '2019-03-05',
                    ownerId: ownerId,
                    status: 'IN PROGRESS',
                    statusUpdatedOn: moment().format('YYYY-MM-DD'),
                    officerId: 1
                }));
    });

    it('should get status with officer and department', async () => {
        const owner = await Owner.create({ email: 'owner@test.com' }, { raw: true });
        const officer = await Officer.create({
            email: 'officer1@police.com',
            department: { name: 'TestDepartment' }
        }, { include: [Department] }).then(res => res.get({ plain: true }));

        const bike: Partial<Bike> = {
            ownerId: owner.id,
            color: 'black',
            fullName: 'John Doe',
            licenseNumber: 'abcd123test',
            type: 'MTB',
            date: new Date('2019-03-05'),
            theftDescription: 'guy in chicken suit'
        };

        const createdBike = await Bike.create(bike);

        const res = await chai.request(app)
            .get('/public/status')
            .set('authorization', owner.id.toString())
            .send(bike);

        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('IN PROGRESS');
        expect(res.body.statusUpdatedOn).to.eql(moment().format('YYYY-MM-DD'));
        expect(res.body.ownerId).to.eql(owner.id);
        expect(res.body.officerId).to.eql(officer.id);

        expect(res.body).to.haveOwnProperty('officer');
        expect(res.body.officer.currentCaseId).to.eql(createdBike.id);

        expect(res.body.officer).to.haveOwnProperty('department');
        expect(res.body.officer.department.name).to.eql('TestDepartment');
    });
});
