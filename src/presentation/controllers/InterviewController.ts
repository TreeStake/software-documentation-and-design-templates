import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../tokens';
import type { IInterviewRepository } from '../../dal/interfaces/IInterviewRepository';
import { Interview } from '../../dal/entities/Interview';

@injectable()
export class InterviewController {
    constructor(
        @inject(TOKENS.IInterviewRepository)
        private interviewRepository: IInterviewRepository
    ) {}

    async getAll(req: Request, res: Response) {
        try {
            res.json(await this.interviewRepository.findAll());
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            const interview = await this.interviewRepository.findById(id);
            if (!interview) return res.status(404).json({ error: 'Interview not found' });
            res.json(interview);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const interview = new Interview();
            Object.assign(interview, req.body);
            res.status(201).json(await this.interviewRepository.save(interview));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            await this.interviewRepository.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            const existing = await this.interviewRepository.findById(id);
            if (!existing) return res.status(404).json({ error: 'Not found' });
            Object.assign(existing, req.body);
            res.json(await this.interviewRepository.save(existing));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
