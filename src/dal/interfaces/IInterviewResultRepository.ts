import { InterviewResult } from '../entities/InterviewResult';

export interface IInterviewResultRepository {
    findAll(): Promise<InterviewResult[]>;
    save(result: InterviewResult): Promise<InterviewResult>;
    delete(id: string): Promise<void>;
}
