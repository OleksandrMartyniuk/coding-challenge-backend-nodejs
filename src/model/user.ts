import { Table, Model, Column, DataType, Unique, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table
export default class User extends Model<User> {
    
    @AutoIncrement
    @PrimaryKey
    @Column
    public id!: number;

    @Unique
    @Column
    public email!: string;

    @Column
    public password!: string;

    @Column(DataType.ENUM('issuer', 'officer', 'admin'))
    public category!: UserCategory;
}

export type UserCategory = 'issuer' | 'officer' | 'admin';