import { injectable } from 'tsyringe';
import { appDataSource } from '../data-source';
import { Interview } from '../entities/Interview';
import { IInterviewRepository } from '../interfaces/IInterviewRepository';

@injectable()
export class InterviewRepository implements IInterviewRepository {
    async save(interview: Interview): Promise<Interview> {
        return appDataSource.getRepository(Interview).save(interview);
    }

    async saveMany(interviews: Interview[]): Promise<Interview[]> {
        if (interviews.length === 0) return [];
        return appDataSource.getRepository(Interview).save(interviews);
    }

    async findById(id: string): Promise<Interview | null> {
        return appDataSource.getRepository(Interview).findOneBy({ id });
    }

    async findAll(): Promise<Interview[]> {
        return appDataSource.getRepository(Interview).find({
            relations: ['candidate', 'recruiter', 'result']
        });
    }

    async delete(id: string): Promise<void> {
        const result = await appDataSource.query(
            'SELECT resultId FROM interviews WHERE id = ?', [id]
        );
        const resId = result.length > 0 ? result[0].resultId : null;

        await appDataSource.query('PRAGMA foreign_keys = OFF');
        try {
            await appDataSource.query('DELETE FROM interviews WHERE id = ?', [id]);
            if (resId) {
                await appDataSource.query('DELETE FROM interview_results WHERE id = ?', [resId]);
            }
        } finally {
            await appDataSource.query('PRAGMA foreign_keys = ON');
        }
    }
}