import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Candidate } from './Candidate';
import { Recruiter } from './Recruiter';
import { InterviewResult } from './InterviewResult';

@Entity('interviews')
export class Interview {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    scheduledDate: Date;

    @Column()
    type: string;

    @ManyToOne(() => Candidate, candidate => candidate.interviews)
    candidate: Candidate;

    @ManyToOne(() => Recruiter, recruiter => recruiter.interviews)
    recruiter: Recruiter;

    @OneToOne(() => InterviewResult, result => result.interview, { cascade: true })
    
    @JoinColumn()
    result: InterviewResult;
}