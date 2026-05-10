import { injectable } from 'tsyringe';
import { appDataSource } from '../data-source';
import { InterviewResult } from '../entities/InterviewResult';
import { Interview } from '../entities/Interview';
import { IInterviewResultRepository } from '../interfaces/IInterviewResultRepository';

@injectable()
export class InterviewResultRepository implements IInterviewResultRepository {
    async findAll(): Promise<InterviewResult[]> {
        const results = await appDataSource.getRepository(InterviewResult).find();
        for (const res of results) {
            const interview = await appDataSource.getRepository(Interview).findOne({
                where: { resultId: res.id } as any,
                relations: ['candidate']
            });
            (res as any).interview = interview;
        }
        return results;
    }

    async save(result: InterviewResult): Promise<InterviewResult> {
        return appDataSource.getRepository(InterviewResult).save(result);
    }

    async delete(id: string): Promise<void> {
        await appDataSource.query('UPDATE interviews SET resultId = NULL WHERE resultId = ?', [id]);
        await appDataSource.query('DELETE FROM interview_results WHERE id = ?', [id]);
    }
}
