import { injectable } from 'tsyringe';
import { DataSource } from 'typeorm';

import { Candidate } from '../entities/Candidate';
import { ICandidateRepository } from '../interfaces/ICandidateRepository';
import { appDataSource } from '../data-source';

@injectable()
export class CandidateRepository implements ICandidateRepository {
    private readonly ds: DataSource;

    constructor() {
        this.ds = appDataSource;
    }

    async save(candidate: Candidate): Promise<Candidate> {
        return this.ds.getRepository(Candidate).save(candidate);
    }

    async saveMany(candidates: Candidate[]): Promise<Candidate[]> {
        if (candidates.length === 0) return [];
        return this.ds.getRepository(Candidate).save(candidates);
    }

    async findById(id: string): Promise<Candidate | null> {
        return this.ds.getRepository(Candidate).findOneBy({ id });
    }

    async findAll(): Promise<Candidate[]> {
        return this.ds.getRepository(Candidate).find();
    }
}