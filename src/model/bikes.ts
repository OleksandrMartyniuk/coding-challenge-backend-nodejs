import { Table, Model, Column, DataType, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, NotNull, Scopes, AfterCreate, BeforeCreate, BeforeUpdate, BeforeSave, Default } from 'sequelize-typescript';
import Owner from './owners';
import Officer from './officer';
import Department from './departments';

@Scopes({
    new: {
        where: { status: 'NEW' }
    },
    withOfficers: {
        include: [{
            model: () => Officer,
            include: [() => Department],
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

    @NotNull
    @Column(DataType.STRING)
    public licenseNumber!: string;

    @NotNull
    @Column(DataType.STRING)
    public color!: string;

    @NotNull
    @Column(DataType.STRING)
    public type!: string;

    @NotNull
    @Column(DataType.STRING)
    public fullName!: string;

    @NotNull
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

    @BeforeCreate
    public static async assignToFreeOfficer(bike: Bike, options: any) {
        const officer = await Officer.useScope('free').findOne();
        if (officer) {
            bike.officer = officer;
            bike.status = 'IN PROGRESS';
            bike.statusUpdatedOn = new Date();
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
}

export type ReportStatus = 'NEW' | 'IN PROGRESS' | 'RESOLVED';