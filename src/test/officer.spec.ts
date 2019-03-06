import { start, app, stop } from '../index';
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import Bike from '../model/bikes';
import Officer from '../model/officer';
import Department from '../model/departments';
import moment = require('moment');

chai.use(chaiHttp)

let db: any;

async function createDepartments(count: number) {
    await Department.bulkCreate(
        new Array(count)
            .fill(null)
            .map((val, i) => ({ name: 'Department' + (i + 1) }))
    );
}

async function createOfficers(departmentId: number, count: number, offset = 0) {
    await Officer.bulkCreate(
        new Array(count)
            .fill(null)
            .map((val, i) => ({ email: `officer${i + offset}@police.com`, departmentId }))
    )
}

async function createBikes(count: number) {
    const bikes = [
        {
            color: 'black',
            fullName: 'John Doe',
            licenseNumber: 'abcd123test',
            type: 'MTB',
            date: new Date('2019-03-05'),
            theftDescription: 'guy in chicken suit'
        }, {
            color: 'white',
            fullName: 'Snoop Dogg',
            licenseNumber: 'gfe34sa',
            type: 'ROAD',
            date: new Date('2019-03-03'),
            theftDescription: 'king-kong'
        }, {
            color: 'red',
            fullName: 'Liam Neeson',
            licenseNumber: 'gfe35sa',
            type: 'MTB',
            date: new Date('2019-03-03'),
            theftDescription: 'superman costumed guy'
        }, {
            color: 'blue',
            fullName: 'Brandon Semeniuk',
            licenseNumber: 'gfe36sa',
            type: 'MTB',
            date: new Date('2019-03-03'),
            theftDescription: 'angry clown'
        }
    ];
    const sliced = bikes.slice(0, count);
    for (const bike of sliced) {
        await Bike.create(bike);
    }
}

describe('Officer', () => {
    before(async () => {
        db = await start;
    });

    after(() => {
        stop();
    });

    beforeEach(async () => {
        await db.sync({ force: true });
    });

    describe('search', () => {
        it('should search bikes by department', async () => {
            await createDepartments(2);
            await createOfficers(1, 1);
            await createOfficers(2, 1, 1);
            await createBikes(2);

            const res = await chai.request(app)
                .get('/officer/bikes/search')
                .query({ departmentId: 1 })
                .send();

            expect(res.status).to.eql(200);
            expect(res.body).to.be.an('array').and.have.length(1);
            expect(res.body[0].status).to.eql('IN PROGRESS');
            expect(res.body[0].officerId).to.eql(1);
            expect(res.body[0]).to.haveOwnProperty('officer');
            expect(res.body[0].officer).to.haveOwnProperty('department');
            expect(res.body[0].officer.department.name).to.eql('Department1');
        });

        it('should search bikes by color', async () => {
            await createDepartments(2);
            await createOfficers(1, 1);
            await createOfficers(2, 1, 1);
            await createBikes(2);

            const res = await chai.request(app)
                .get('/officer/bikes/search')
                .query({ color: 'black' })
                .send();

            expect(res.status).to.eql(200);
            expect(res.body).to.be.an('array').and.have.length(1);
            expect(res.body[0].status).to.eql('IN PROGRESS');
            expect(res.body[0].officerId).to.eql(1);
            expect(res.body[0]).to.haveOwnProperty('officer');
            expect(res.body[0].officer).to.haveOwnProperty('department');
            expect(res.body[0].officer.department.name).to.eql('Department1');
        });

        it('should search bikes by name', async () => {
            await createDepartments(2);
            await createOfficers(1, 1);
            await createOfficers(2, 1, 1);
            await createBikes(2);

            const res = await chai.request(app)
                .get('/officer/bikes/search')
                .query({ fullName: 'Snoop' })
                .send();

            expect(res.status).to.eql(200);
            expect(res.body).to.be.an('array').and.have.length(1);
            expect(res.body[0].status).to.eql('IN PROGRESS');
            expect(res.body[0].officerId).to.eql(2);
            expect(res.body[0]).to.haveOwnProperty('officer');
            expect(res.body[0].officer).to.haveOwnProperty('department');
            expect(res.body[0].officer.department.name).to.eql('Department2');
        });

        it('should search bikes by licenseNumber', async () => {
            await createDepartments(2);
            await createOfficers(1, 1);
            await createOfficers(2, 1, 1);
            await createBikes(2);

            const res = await chai.request(app)
                .get('/officer/bikes/search')
                .query({ licenseNumber: 'gfe34sa' })
                .send();

            expect(res.status).to.eql(200);
            expect(res.body).to.be.an('array').and.have.length(1);
            expect(res.body[0].status).to.eql('IN PROGRESS');
            expect(res.body[0].officerId).to.eql(2);
            expect(res.body[0]).to.haveOwnProperty('officer');
            expect(res.body[0].officer).to.haveOwnProperty('department');
            expect(res.body[0].officer.department.name).to.eql('Department2');
        });

        it('should search bikes by department and color', async () => {
            await createDepartments(2);
            await createOfficers(1, 1);
            await createOfficers(2, 1, 1);
            await createBikes(4);

            const res = await chai.request(app)
                .get('/officer/bikes/search')
                .query({ departmentId: 2, color: 'white' })
                .send();

            expect(res.status).to.eql(200);
            expect(res.body).to.be.an('array').and.have.length(1);
            expect(res.body[0].status).to.eql('IN PROGRESS');
            expect(res.body[0].officerId).to.eql(2);
            expect(res.body[0]).to.haveOwnProperty('officer');
            expect(res.body[0].officer).to.haveOwnProperty('department');
            expect(res.body[0].officer.department.name).to.eql('Department2');
        });
    });

    it('should get officer and current case by officer Id', async () => {
        await createDepartments(2);
        await createOfficers(1, 1);
        await createOfficers(2, 1, 1);
        await createBikes(2);

        const res = await chai.request(app)
            .get('/officer/1')
            .send();

        expect(res.status).to.eql(200);
        expect(res.body).to.haveOwnProperty('id').that.eql(1);
        expect(res.body).to.haveOwnProperty('currentCase')
            .that.haveOwnProperty('id').that.eql(1);
    });

    it('should resolve officer\'s current case and assign another one ', async () => {
        await createDepartments(2);
        await createOfficers(1, 1);
        await createOfficers(2, 1, 1);
        await createBikes(3);

        const res = await chai.request(app)
            .post('/officer/1/resolve')
            .send();

        const resolved = await Bike.findByPk(1);

        expect(res.status).to.eql(200);
        expect(res.body).to.haveOwnProperty('id').that.eql(1);
        expect(res.body).to.haveOwnProperty('currentCase')
            .that.haveOwnProperty('id').that.eql(3);
        expect(res.body.currentCase.status).to.eql('IN PROGRESS');
        expect(res.body.lastCaseResolvedOn).to.eql(moment().format('YYYY-MM-DD'));

        expect(resolved.status).to.eql('RESOLVED');
        expect(resolved.statusUpdatedOn).to.eql(moment().format('YYYY-MM-DD'));
    });
});
