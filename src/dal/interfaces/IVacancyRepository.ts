import { Vacancy } from '../entities/Vacancy';

export interface IVacancyRepository {
    save(vacancy: Vacancy): Promise<Vacancy>;
    saveMany(vacancies: Vacancy[]): Promise<Vacancy[]>;
    findById(id: string): Promise<Vacancy | null>;
    findAll(): Promise<Vacancy[]>;
    delete(id: string): Promise<void>;
}