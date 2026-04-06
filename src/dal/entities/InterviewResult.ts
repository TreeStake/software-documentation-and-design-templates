import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Interview } from './Interview';

@Entity('interview_results')
export class InterviewResult {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    score: number;

    @Column('text')
    feedback: string;

    @Column()
    isPassed: boolean;

    @OneToOne(() => Interview, interview => interview.result)
    interview: Interview;
}