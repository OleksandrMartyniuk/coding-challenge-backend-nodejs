import { start, app, stop } from '../index';
import Department from '../model/departments';
import Officer from '../model/officer';
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

chai.use(chaiHttp)

let db: any;

describe.only('Admin', () => {
    before(async () => {
        db = await start;
    });

    after(() => {
        stop();
    });

    beforeEach(async () => {
        await db.sync({ force: true });
    });

    it('should return department with all officers', async () => {
        const department = {
            name: 'TestDepartment',
            officers: [
                { email: 'officer1@police.com' },
                { email: 'officer2@police.com' }
            ]
        };

        await Department.create(department, { include: [Officer] });

        const res = await chai.request(app)
            .get('/admin/department')
            .send();

        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('array').and.have.length(1);
        expect(res.body[0]).to.haveOwnProperty('id').that.eql(1);
        expect(res.body[0]).to.haveOwnProperty('name').that.eqls('TestDepartment');
        expect(res.body[0].officers).to.be.an('array').and.have.length(2);
        expect(res.body[0].officers[0]).to.haveOwnProperty('email').that.eql('officer1@police.com');
        expect(res.body[0].officers[1]).to.haveOwnProperty('email').that.eql('officer2@police.com');
    });

    it('it should create department with no officers', async () => {
        const department: Partial<Department> = {
            name: 'TestDepartment'
        };

        const res = await chai.request(app)
            .post('/admin/department')
            .send(department);

        expect(res.status).to.eql(200);
        expect(res.body).to.haveOwnProperty('id').that.eql(1);
        expect(res.body).to.haveOwnProperty('name').that.eqls(department.name);
    });

    it('it should create department with one officer', async () => {
        const department = {
            name: 'TestDepartment',
            officers: [{ email: 'officer1@police.com' }]
        };

        const res = await chai.request(app)
            .post('/admin/department')
            .send(department);

        expect(res.status).to.eql(200);
        expect(res.body).to.haveOwnProperty('id').that.eql(1);
        expect(res.body).to.haveOwnProperty('name').that.eqls(department.name);
        expect(res.body.officers).to.be.an('array').and.have.length(1);
        expect(res.body.officers[0]).to.haveOwnProperty('email').that.eql('officer1@police.com');
    });

    it('it should create department with two officers', async () => {
        const department = {
            name: 'TestDepartment',
            officers: [
                { email: 'officer1@police.com' },
                { email: 'officer2@police.com' }
            ]
        };

        const res = await chai.request(app)
            .post('/admin/department')
            .send(department);

        expect(res.status).to.eql(200);
        expect(res.body).to.haveOwnProperty('id').that.eql(1);
        expect(res.body).to.haveOwnProperty('name').that.eqls(department.name);
        expect(res.body.officers).to.be.an('array').and.have.length(2);
        expect(res.body.officers[0]).to.haveOwnProperty('email').that.eql('officer1@police.com');
        expect(res.body.officers[1]).to.haveOwnProperty('email').that.eql('officer2@police.com');
    });

    it('it should not create department with duplicate officers', async () => {
        const department = {
            name: 'TestDepartment',
            officers: [
                { email: 'officer1@police.com' },
                { email: 'officer1@police.com' }
            ]
        };

        const res = await chai.request(app)
            .post('/admin/department')
            .send(department);

        expect(res.status).to.eql(500);
        expect(res.body).to.haveOwnProperty('message').that.includes('Duplicate entry').and.includes('email');
    });

    it('should create officers for department', async () => {
        const department = {
            name: 'TestDepartment'
        };

        const officers = [
            { email: 'officer1@police.com' },
            { email: 'officer2@police.com' }
        ];

        const createdDepartment = await Department.create(department);

        const res = await chai.request(app)
            .post('/admin/department/1/officers')
            .send(officers);

        const createdOfficers = await Officer.findAll({ raw: true });

        expect(res.status).to.eql(200);
        expect(createdOfficers).to.be.an('array').and.have.length(2);
        expect(createdOfficers[0]).to.haveOwnProperty('email').that.eql('officer1@police.com');
        expect(createdOfficers[0]).to.haveOwnProperty('departmentId').that.eql(createdDepartment.id);

        expect(createdOfficers[1]).to.haveOwnProperty('email').that.eql('officer2@police.com');
        expect(createdOfficers[1]).to.haveOwnProperty('departmentId').that.eql(createdDepartment.id);
    });

    it('should move officers to another department', async () => {
        const departmentFrom = {
            name: 'TestDepartment',
            officers: [
                { email: 'officer1@police.com' },
                { email: 'officer2@police.com' }
            ]
        };

        const departmentTo = {
            name: 'TestDepartment1'
        };

        await Department.create(departmentFrom, { include: [Officer] })
        await Department.create(departmentTo);

        const res = await chai.request(app)
            .put('/admin/department/2/officers')
            .send([1, 2]);

        const createdOfficers = await Officer.findAll({ raw: true });

        expect(res.status).to.eql(200);
        expect(createdOfficers).to.be.an('array').and.have.length(2);
        expect(createdOfficers[0]).to.haveOwnProperty('email').that.eql('officer1@police.com');
        expect(createdOfficers[0]).to.haveOwnProperty('departmentId').that.eql(2);

        expect(createdOfficers[1]).to.haveOwnProperty('email').that.eql('officer2@police.com');
        expect(createdOfficers[1]).to.haveOwnProperty('departmentId').that.eql(2);
    });

    it('should not move officers to department that does not exist', async () => {
        const departmentFrom = {
            name: 'TestDepartment',
            officers: [
                { email: 'officer1@police.com' },
                { email: 'officer2@police.com' }
            ]
        };

        await Department.create(departmentFrom, { include: [Officer] })

        const res = await chai.request(app)
            .put('/admin/department/2/officers')
            .send([1, 2]);

        const createdOfficers = await Officer.findAll({ raw: true });

        expect(res.status).to.eql(404);
        expect(res.body.message).to.eql('Department not found');
        expect(createdOfficers).to.be.an('array').and.have.length(2);
        expect(createdOfficers[0]).to.haveOwnProperty('email').that.eql('officer1@police.com');
        expect(createdOfficers[0]).to.haveOwnProperty('departmentId').that.eql(1);

        expect(createdOfficers[1]).to.haveOwnProperty('email').that.eql('officer2@police.com');
        expect(createdOfficers[1]).to.haveOwnProperty('departmentId').that.eql(1);
    });
});
