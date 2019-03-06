import { Table, Model, Column, DataType, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, NotNull, Scopes, AfterCreate, BeforeCreate, BeforeUpdate, BeforeSave, Default, HasOne } from 'sequelize-typescript';
import Owner from './owners';
import Officer from './officer';
import Department from './departments';
import sequelize from 'sequelize';

@Scopes({
    new: {
        where: { status: 'NEW' }
    },
    withOfficers: {
        include: [{
            model: () => Officer,
            include: [{
                model: () => Department,
                required: false
            }],
            required: false
        }]
    }
})
@Table
export default class Bike extends Model<Bike> {

    @AutoIncrement
    @PrimaryKey
    @Column
    public id!: number;

    @Column(DataType.STRING)
    public licenseNumber!: string;

    @Column(DataType.STRING)
    public color!: string;

    @Column(DataType.STRING)
    public type!: string;

    @Column(DataType.STRING)
    public fullName!: string;

    @Column(DataType.DATEONLY)
    public date!: Date;

    @Column(DataType.STRING)
    public theftDescription!: string;

    @Column(DataType.DATEONLY)
    public statusUpdatedOn!: Date

    @Default('NEW')
    @Column(DataType.ENUM(['NEW', 'IN PROGRESS', 'RESOLVED']))
    public status: ReportStatus;

    @BelongsTo(() => Owner)
    public owner!: Owner;

    @ForeignKey(() => Owner)
    public ownerId!: number;

    @BelongsTo(() => Officer)
    public officer?: Officer;

    @ForeignKey(() => Officer)
    public officerId?: number;

    public assignToOfficer(officer: Officer) {
        const now = new Date();
        this.officerId = officer.id;
        this.status = 'IN PROGRESS';
        this.statusUpdatedOn = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return this;
    }

    @BeforeCreate
    public static async assignToFreeOfficer(bike: Bike, options: any) {
        const officer = await Officer.useScope('free').findOne();
        if (officer) {
            bike.assignToOfficer(officer);
        }
    }

    @AfterCreate
    public static async setOfficersCurrentCase(bike: Bike, options: any) {
        if (bike.officerId) {
            await Officer.update({ currentCaseId: bike.id }, { where: { id: bike.officerId } });
        }
    }

    public static async findUnassignedCase() {
        return Bike.useScope('new').findOne();
    }

    public static findByUserId(id: string | number) {
        return Bike.useScope('withOfficers').findOne({ where: { ownerId: id } });
    }

    public static useScope(scope: 'new' | 'withOfficers') {
        return Bike.scope(scope);
    }

    public static async search(request: any) {
        let result;
        if (request) {
            const query = new BikesSearchQueryBuilder(request)
                .addDepartmentIdSection()
                .addPropsSection()
                .query
            result = await Bike.useScope('withOfficers').findAll(query);
        } else {
            result = await Bike.useScope('withOfficers').findAll();
        }
        return result;
    }
}

export type ReportStatus = 'NEW' | 'IN PROGRESS' | 'RESOLVED';

export class BikesSearchQueryBuilder {
    constructor(
        private request: any,
        public searchByProperties = [
            'licenseNumber',
            'color',
            'type',
            'fullName',
            'theftDescription'
        ]) { }

    public query: any = { where: {} };

    public addDepartmentIdSection() {
        if (this.request.departmentId) {
            this.query.include = [{
                model: Officer,
                include: [{
                    model: Department,
                    where: {
                        id: this.request.departmentId
                    },
                    required: true
                }],
                required: true
            }]
        }
        return this;
    }

    public addPropsSection() {
        for (const prop of this.searchByProperties || []) {
            if (this.request[prop]) {
                this.query.where[prop] = { [sequelize.Op.like]: '%' + this.request[prop] + '%' }
            }
        }
        return this;
    }
}
