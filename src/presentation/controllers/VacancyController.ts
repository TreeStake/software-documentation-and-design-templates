import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../tokens';
import type { IVacancyRepository } from '../../dal/interfaces/IVacancyRepository';
import { Vacancy } from '../../dal/entities/Vacancy';

@injectable()
export class VacancyController {
    constructor(
        @inject(TOKENS.IVacancyRepository)
        private vacancyRepository: IVacancyRepository
    ) {}

    async getAll(req: Request, res: Response) {
        try {
            res.json(await this.vacancyRepository.findAll());
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            const vacancy = await this.vacancyRepository.findById(id);
            if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });
            res.json(vacancy);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const vacancy = new Vacancy();
            Object.assign(vacancy, req.body);
            res.status(201).json(await this.vacancyRepository.save(vacancy));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            await this.vacancyRepository.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'ID is required' });
            const existing = await this.vacancyRepository.findById(id);
            if (!existing) return res.status(404).json({ error: 'Not found' });
            Object.assign(existing, req.body);
            res.json(await this.vacancyRepository.save(existing));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
