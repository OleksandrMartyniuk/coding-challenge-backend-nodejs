import { Model, Column, Table, HasMany, ForeignKey, BelongsTo, PrimaryKey, DataType } from "sequelize-typescript";
import Bike from './bikes';
import User from './user';

@Table
export default class Owner extends Model<Owner> {

    @PrimaryKey
    @Column(DataType.INTEGER)
    public id!: number;

    @Column
    public name!: string;

    @BelongsTo(() => User)
    public user!: User;

    @ForeignKey(() => User)
    public userId!: number;

    @HasMany(() => Bike)
    public bikes!: Bike[];
}