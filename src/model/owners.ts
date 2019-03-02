import { Model, Column, Table, PrimaryKey, AutoIncrement, DataType, HasMany } from "sequelize-typescript";
import Bike from './bikes';

@Table
export default class Owner extends Model<Owner> {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    public id!: number;

    @Column(DataType.STRING)
    public email!: string;

    @HasMany(() => Bike)
    public bikes!: Bike[];
}