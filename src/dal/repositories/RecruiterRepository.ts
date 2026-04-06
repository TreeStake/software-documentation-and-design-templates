import { injectable } from 'tsyringe';
import { DataSource } from 'typeorm';
import { appDataSource } from '../data-source';

import { Recruiter } from '../entities/Recruiter';
import { IRecruiterRepository } from '../interfaces/IRecruiterRepository';

@injectable()
export class RecruiterRepository implements IRecruiterRepository {
    private readonly ds: DataSource;

    constructor() {
        this.ds = appDataSource;
    }

    async save(recruiter: Recruiter): Promise<Recruiter> {
        return this.ds.getRepository(Recruiter).save(recruiter);
    }

    async saveMany(recruiters: Recruiter[]): Promise<Recruiter[]> {
        if (recruiters.length === 0) return [];
        return this.ds.getRepository(Recruiter).save(recruiters);
    }

    async findById(id: string): Promise<Recruiter | null> {
        return this.ds.getRepository(Recruiter).findOneBy({ id });
    }

    async findAll(): Promise<Recruiter[]> {
        return this.ds.getRepository(Recruiter).find();
    }
}