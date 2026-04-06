import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './User';
import { Vacancy } from './Vacancy';
import { Interview } from './Interview';

@Entity('recruiters')
export class Recruiter extends User {
    @Column()
    department: string;

    @Column('int')
    successfulHires: number;

    @Column('int')
    activeVacanciesCount: number;

    @Column('int')
    averageTimeToHire: number;

    @OneToMany(() => Vacancy, vacancy => vacancy.recruiter)
    vacancies: Vacancy[];

    @OneToMany(() => Interview, interview => interview.recruiter)
    interviews: Interview[];
}