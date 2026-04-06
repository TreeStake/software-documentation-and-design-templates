import { Candidate } from '../entities/Candidate';

export interface ICandidateRepository {
    save(candidate: Candidate): Promise<Candidate>;
    saveMany(candidates: Candidate[]): Promise<Candidate[]>;
    findById(id: string): Promise<Candidate | null>;
    findAll(): Promise<Candidate[]>;
}