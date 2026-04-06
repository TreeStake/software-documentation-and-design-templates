import { injectable } from 'tsyringe';
import { DataSource } from 'typeorm';
import { appDataSource } from '../data-source';

import { Vacancy } from '../entities/Vacancy';
import { IVacancyRepository } from '../interfaces/IVacancyRepository';

@injectable()
export class VacancyRepository implements IVacancyRepository {
    private readonly ds: DataSource;

    constructor() {
        this.ds = appDataSource;
    }

    async save(vacancy: Vacancy): Promise<Vacancy> {
        return this.ds.getRepository(Vacancy).save(vacancy);
    }

    async saveMany(vacancies: Vacancy[]): Promise<Vacancy[]> {
        if (vacancies.length === 0) return [];
        return this.ds.getRepository(Vacancy).save(vacancies);
    }

    async findById(id: string): Promise<Vacancy | null> {
        return this.ds.getRepository(Vacancy).findOneBy({ id });
    }

    async findAll(): Promise<Vacancy[]> {
        return this.ds.getRepository(Vacancy).find();
    }
}