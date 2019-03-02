import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import Officer from './officer';
import Bike from './bikes';


@Table
export default class Department extends Model<Department> {
    
    @Column(DataType.STRING)
    public name!: string;

    @HasMany(() => Officer)
    public officers!: Officer[];

    @HasMany(() => Bike)
    public bikes!: Bike[];
}