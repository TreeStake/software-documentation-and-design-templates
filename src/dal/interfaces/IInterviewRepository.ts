import { Interview } from '../entities/Interview';

export interface IInterviewRepository {
    save(interview: Interview): Promise<Interview>;
    saveMany(interviews: Interview[]): Promise<Interview[]>;
    findById(id: string): Promise<Interview | null>;
    findAll(): Promise<Interview[]>;
    delete(id: string): Promise<void>;
}