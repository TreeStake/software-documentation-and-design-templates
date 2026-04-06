import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Candidate } from './Candidate';
import { Recruiter } from './Recruiter';

@Entity('vacancies')
export class Vacancy {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    requiredSkills: string;

    @Column()
    isActive: boolean;

    @OneToMany(() => Candidate, candidate => candidate.vacancy)
    candidates: Candidate[];

    @ManyToOne(() => Recruiter, recruiter => recruiter.vacancies)
    recruiter: Recruiter;
}