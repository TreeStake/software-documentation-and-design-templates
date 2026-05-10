import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}