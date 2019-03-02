import { Table, Model, Column, DataType, BelongsTo, ForeignKey, PrimaryKey } from "sequelize-typescript";
import Owner from "./owners";
import Department from "./departments";
import Officer from "./officer";

@Table
export default class Bike extends Model<Bike> {

    @PrimaryKey
    @Column(DataType.INTEGER)
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

    @BelongsTo(() => Owner)
    public owner!: Owner;

    @ForeignKey(() => Owner)
    public ownerId!: number;

    @BelongsTo(() => Department)
    public department!: Department;

    @ForeignKey(() => Department)
    public departmentId!: number;

    @BelongsTo(() => Officer)
    public officer?: Officer;

    @ForeignKey(() => Officer)
    public officerId?: number;
}