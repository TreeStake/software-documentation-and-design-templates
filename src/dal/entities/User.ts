import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;
}