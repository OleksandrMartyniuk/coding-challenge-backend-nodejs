import { Table, Model, Column, BelongsTo, HasOne, ForeignKey } from "sequelize-typescript";
import Bike from './bikes';
import Department from "./departments";

@Table
export default class Officer extends Model<Officer> {

    @Column
    public name!: string;

    @BelongsTo(() => Department)
    public department!: Department;

    @ForeignKey(() => Department)
    public departmentId!: number;

    @HasOne(() => Bike, 'bikeId')
    public bike?: Bike;
}