import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../tokens';
import type { ICandidateRepository } from '../../dal/interfaces/ICandidateRepository';
import { Candidate } from '../../dal/entities/Candidate';

@injectable()
export class CandidateController {
    constructor(
        @inject(TOKENS.ICandidateRepository)
        private candidateRepository: ICandidateRepository
    ) {}

    async getAll(req: Request, res: Response) {
        try {
            res.json(await this.candidateRepository.findAll());
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            const candidate = await this.candidateRepository.findById(id);
            if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
            res.json(candidate);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const candidate = new Candidate();
            Object.assign(candidate, req.body);
            res.status(201).json(await this.candidateRepository.save(candidate));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            await this.candidateRepository.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            const existing = await this.candidateRepository.findById(id);
            if (!existing) return res.status(404).json({ error: 'Not found' });
            Object.assign(existing, req.body);
            res.json(await this.candidateRepository.save(existing));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
