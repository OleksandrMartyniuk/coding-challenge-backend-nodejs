import { Table, Model, Column, HasMany, PrimaryKey, DataType } from 'sequelize-typescript';
import Officer from './officer';
import Bike from './bikes';

@Table
export default class Department extends Model<Department> {

    @PrimaryKey
    @Column(DataType.INTEGER)
    public id!: number;
    
    @Column
    public name!: string;

    @HasMany(() => Officer)
    public officers!: Officer[];

    @HasMany(() => Bike)
    public bikes!: Bike[];
}