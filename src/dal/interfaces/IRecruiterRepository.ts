import { Recruiter } from '../entities/Recruiter';

export interface IRecruiterRepository {
    save(recruiter: Recruiter): Promise<Recruiter>;
    saveMany(recruiters: Recruiter[]): Promise<Recruiter[]>;
    findById(id: string): Promise<Recruiter | null>;
    findAll(): Promise<Recruiter[]>;
}