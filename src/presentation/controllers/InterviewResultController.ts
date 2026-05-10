import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../tokens';
import type { IInterviewResultRepository } from '../../dal/interfaces/IInterviewResultRepository';
import { InterviewResult } from '../../dal/entities/InterviewResult';
import { Interview } from '../../dal/entities/Interview';
import { appDataSource } from '../../dal/data-source';

@injectable()
export class InterviewResultController {
    constructor(
        @inject(TOKENS.IInterviewResultRepository)
        private repo: IInterviewResultRepository
    ) {}

    async getAll(req: Request, res: Response) {
        try {
            res.json(await this.repo.findAll());
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { interviewId, score, isPassed, feedback } = req.body;
            
            const result = new InterviewResult();
            result.score = score;
            result.isPassed = isPassed;
            result.feedback = feedback;
            
            const savedResult = await this.repo.save(result);

            if (interviewId) {
                await appDataSource.getRepository(Interview).update(interviewId, {
                    resultId: savedResult.id
                });
            }

            res.status(201).json(savedResult);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            await this.repo.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            const existing = await appDataSource.getRepository(InterviewResult).findOneBy({ id });
            if (!existing) return res.status(404).json({ error: 'Not found' });
            Object.assign(existing, req.body);
            res.json(await this.repo.save(existing));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
