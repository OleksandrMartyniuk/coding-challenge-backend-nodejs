import { Model, Column, Table, HasMany, PrimaryKey, Unique, AutoIncrement } from "sequelize-typescript";
import Bike from './bikes';

@Table
export default class Owner extends Model<Owner> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id!: number;

    @Unique
    @Column
    public email!: string;

    @HasMany(() => Bike)
    public bikes!: Bike[];
}