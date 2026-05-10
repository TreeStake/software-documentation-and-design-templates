import { injectable } from 'tsyringe';
import { appDataSource } from '../data-source';
import { Recruiter } from '../entities/Recruiter';
import { IRecruiterRepository } from '../interfaces/IRecruiterRepository';

@injectable()
export class RecruiterRepository implements IRecruiterRepository {
    async save(recruiter: Recruiter): Promise<Recruiter> {
        return appDataSource.getRepository(Recruiter).save(recruiter);
    }

    async saveMany(recruiters: Recruiter[]): Promise<Recruiter[]> {
        if (recruiters.length === 0) return [];
        return appDataSource.getRepository(Recruiter).save(recruiters);
    }

    async findById(id: string): Promise<Recruiter | null> {
        return appDataSource.getRepository(Recruiter).findOneBy({ id });
    }

    async findAll(): Promise<Recruiter[]> {
        return appDataSource.getRepository(Recruiter).find();
    }

    async delete(id: string): Promise<void> {
        await appDataSource.query(
            'UPDATE interviews SET recruiterId = NULL WHERE recruiterId = ?', [id]
        );
        await appDataSource.query(
            'UPDATE vacancies SET recruiterId = NULL WHERE recruiterId = ?', [id]
        );
        await appDataSource.query(
            'DELETE FROM recruiters WHERE id = ?', [id]
        );
    }
}