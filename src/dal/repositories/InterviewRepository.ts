import { injectable } from 'tsyringe';
import { DataSource } from 'typeorm';
import { appDataSource } from '../data-source';

import { Interview } from '../entities/Interview';
import { IInterviewRepository } from '../interfaces/IInterviewRepository';

@injectable()
export class InterviewRepository implements IInterviewRepository {
    private readonly ds: DataSource;

    constructor() {
        this.ds = appDataSource;
    }

    async save(interview: Interview): Promise<Interview> {
        return this.ds.getRepository(Interview).save(interview);
    }

    async saveMany(interviews: Interview[]): Promise<Interview[]> {
        if (interviews.length === 0) return [];
        return this.ds.getRepository(Interview).save(interviews);
    }

    async findById(id: string): Promise<Interview | null> {
        return this.ds.getRepository(Interview).findOneBy({ id });
    }

    async findAll(): Promise<Interview[]> {
        return this.ds.getRepository(Interview).find();
    }
}