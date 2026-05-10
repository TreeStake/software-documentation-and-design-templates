import { injectable } from 'tsyringe';
import { appDataSource } from '../data-source';
import { Candidate } from '../entities/Candidate';
import { ICandidateRepository } from '../interfaces/ICandidateRepository';

@injectable()
export class CandidateRepository implements ICandidateRepository {
    async save(candidate: Candidate): Promise<Candidate> {
        return appDataSource.getRepository(Candidate).save(candidate);
    }

    async saveMany(candidates: Candidate[]): Promise<Candidate[]> {
        if (candidates.length === 0) return [];
        return appDataSource.getRepository(Candidate).save(candidates);
    }

    async findById(id: string): Promise<Candidate | null> {
        return appDataSource.getRepository(Candidate).findOneBy({ id });
    }

    async findAll(): Promise<Candidate[]> {
        return appDataSource.getRepository(Candidate).find();
    }

    async delete(id: string): Promise<void> {
        await appDataSource.query(
            `UPDATE interviews SET candidateId = NULL WHERE candidateId = ?`, [id]
        );
        await appDataSource.query(
            `DELETE FROM candidates WHERE id = ?`, [id]
        );
    }
}