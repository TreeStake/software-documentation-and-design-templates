import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Vacancy } from './Vacancy';
import { Interview } from './Interview';

@Entity('candidates')
export class Candidate extends User {
    @Column()
    resumeUrl: string;

    @Column()
    skills: string;

    @Column()
    status: string;

    @ManyToOne(() => Vacancy, vacancy => vacancy.candidates)
    vacancy: Vacancy;

    @OneToMany(() => Interview, interview => interview.candidate)
    interviews: Interview[];
}