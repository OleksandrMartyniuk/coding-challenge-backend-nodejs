import { Table, Model, Column, BelongsTo, HasOne, ForeignKey, PrimaryKey, Unique, AutoIncrement, DataType, NotNull, Scopes, BeforeCreate } from 'sequelize-typescript';
import Bike from './bikes';
import Department from './departments';

@Scopes({
    free: {
        where: { currentCaseId: null },
        order: ['lastCaseResolvedOn', 'ASC']
    },
    withCase: {
        include: [() => Bike]
    }
})
@Table
export default class Officer extends Model<Officer> {

    @AutoIncrement
    @PrimaryKey
    @Column
    public id!: number;

    @Unique
    @Column
    public email!: string;

    @BelongsTo(() => Department)
    public department!: Department;

    @ForeignKey(() => Department)
    @Column
    public departmentId!: number;

    @HasOne(() => Bike)
    public currentCase?: Bike;

    @ForeignKey(() => Bike)
    @Column
    public currentCaseId: number;

    @Column(DataType.DATEONLY)
    public lastCaseResolvedOn: Date

    @BeforeCreate
    public static async findUnassignedCase(officer: Officer, options: any) {
        const bike = await Bike.findUnassignedCase();
        officer.currentCase = bike;
    }

    public static async createOfficersForDepartment(departmentId: number, models: Partial<Officer>[]) {
        const department = await Department.findByPk(departmentId);
        if (!department) {
            throw { status: 404, message: 'Department not found' };
        }
        return this.sequelize.transaction({}, async (t) => {
            models.forEach(m => m.departmentId = departmentId);
            return Officer.bulkCreate(models);
        });
    }

    public static async moveOfficersToDepartment(departmentId: number, officerIds: number[]) {
        const department = await Department.findByPk(departmentId);
        if (!department) {
            throw { status: 404, message: 'Department not found' };
        }
        return Officer.update({ departmentId: departmentId }, { where: { id: officerIds } });
    }

    public static useScope(scope: 'free' | 'withCase') {
        return Officer.scope(scope);
    }

    public async resolveCurrentCase(): Promise<Officer> {
        if (!this.currentCaseId) {
            return;
        }
        const now = new Date();

        const currentCase = await Bike.findByPk(this.currentCaseId);
        const bikeUpdates: Partial<Bike> = { status: 'RESOLVED', statusUpdatedOn: now };
        const officerUpdates: Partial<Officer> = { lastCaseResolvedOn: now, currentCaseId: null };

        return this.sequelize.transaction({}, async (t) => {
            await currentCase.update(bikeUpdates, { transaction: t });
            return this.update(officerUpdates, { transaction: t });
        });
    }
}