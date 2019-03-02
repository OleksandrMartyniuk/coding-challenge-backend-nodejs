import { Table, Model, Column, BelongsTo, HasOne, ForeignKey, PrimaryKey, DataType } from "sequelize-typescript";
import Bike from './bikes';
import Department from "./departments";
import User from "./user";

@Table
export default class Officer extends Model<Officer> {

    @PrimaryKey
    @Column(DataType.INTEGER)
    public id!: number;

    @Column
    public name!: string;

    @BelongsTo(() => User)
    public user!: User;

    @ForeignKey(() => User)
    public userId!: number;

    @BelongsTo(() => Department)
    public department!: Department;

    @ForeignKey(() => Department)
    public departmentId!: number;

    @HasOne(() => Bike, 'bikeId')
    public bike?: Bike;
}