import { Table, Model, Column, HasMany, PrimaryKey, AutoIncrement, Scopes } from 'sequelize-typescript';
import Officer from './officer';

@Scopes({
    withOfficers: {
        include: [() => Officer]
    }
})
@Table
export default class Department extends Model<Department> {

    @AutoIncrement
    @PrimaryKey
    @Column
    public id!: number;

    @Column
    public name!: string;

    @HasMany(() => Officer)
    public officers!: Officer[];
}
