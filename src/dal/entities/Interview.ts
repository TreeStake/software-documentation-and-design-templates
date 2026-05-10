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

    @Column({ nullable: true })
    candidateId: string;

    @Column({ nullable: true })
    recruiterId: string;

    @Column({ nullable: true })
    resultId: string;

    @ManyToOne(() => Candidate, candidate => candidate.interviews)
    @JoinColumn({ name: 'candidateId' })
    candidate: Candidate;

    @ManyToOne(() => Recruiter, recruiter => recruiter.interviews)
    @JoinColumn({ name: 'recruiterId' })
    recruiter: Recruiter;

    @OneToOne(() => InterviewResult, { nullable: true, cascade: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'resultId' })
    result: InterviewResult;
}