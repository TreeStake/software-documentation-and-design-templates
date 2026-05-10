import { injectable } from 'tsyringe';
import { appDataSource } from '../data-source';
import { Vacancy } from '../entities/Vacancy';
import { IVacancyRepository } from '../interfaces/IVacancyRepository';

@injectable()
export class VacancyRepository implements IVacancyRepository {
    async save(vacancy: Vacancy): Promise<Vacancy> {
        return appDataSource.getRepository(Vacancy).save(vacancy);
    }

    async saveMany(vacancies: Vacancy[]): Promise<Vacancy[]> {
        if (vacancies.length === 0) return [];
        return appDataSource.getRepository(Vacancy).save(vacancies);
    }

    async findById(id: string): Promise<Vacancy | null> {
        return appDataSource.getRepository(Vacancy).findOneBy({ id });
    }

    async findAll(): Promise<Vacancy[]> {
        return appDataSource.getRepository(Vacancy).find();
    }

    async delete(id: string): Promise<void> {
        await appDataSource.query(
            'UPDATE candidates SET vacancyId = NULL WHERE vacancyId = ?', [id]
        );
        await appDataSource.query(
            'DELETE FROM vacancies WHERE id = ?', [id]
        );
    }
}