import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../tokens';
import type { IRecruiterRepository } from '../../dal/interfaces/IRecruiterRepository';
import { Recruiter } from '../../dal/entities/Recruiter';

@injectable()
export class RecruiterController {
    constructor(
        @inject(TOKENS.IRecruiterRepository)
        private recruiterRepository: IRecruiterRepository
    ) {}

    async getAll(req: Request, res: Response) {
        try {
            res.json(await this.recruiterRepository.findAll());
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            const recruiter = await this.recruiterRepository.findById(id);
            if (!recruiter) return res.status(404).json({ error: 'Recruiter not found' });
            res.json(recruiter);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const recruiter = new Recruiter();
            Object.assign(recruiter, req.body);
            res.status(201).json(await this.recruiterRepository.save(recruiter));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            await this.recruiterRepository.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            const existing = await this.recruiterRepository.findById(id);
            if (!existing) return res.status(404).json({ error: 'Not found' });
            Object.assign(existing, req.body);
            res.json(await this.recruiterRepository.save(existing));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
