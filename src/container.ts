import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS } from './tokens';

import { ICsvReader } from './dal/interfaces/ICsvReader';
import { IDataImportService } from './bll/interfaces/IDataImportService';

import { CsvReader } from './dal/repositories/CsvReader';
import { DataImportService } from './bll/services/DataImportService';
import { CandidateRepository } from './dal/repositories/CandidateRepository';
import { RecruiterRepository } from './dal/repositories/RecruiterRepository';
import { VacancyRepository } from './dal/repositories/VacancyRepository';
import { InterviewRepository } from './dal/repositories/InterviewRepository';
import { ICandidateRepository } from './dal/interfaces/ICandidateRepository';
import { IRecruiterRepository } from './dal/interfaces/IRecruiterRepository';
import { IVacancyRepository } from './dal/interfaces/IVacancyRepository';
import { IInterviewRepository } from './dal/interfaces/IInterviewRepository';


container.register<ICsvReader>(TOKENS.ICsvReader, { useClass: CsvReader });
container.register<ICandidateRepository>(TOKENS.ICandidateRepository, { useClass: CandidateRepository });
container.register<IRecruiterRepository>(TOKENS.IRecruiterRepository, { useClass: RecruiterRepository });
container.register<IVacancyRepository>(TOKENS.IVacancyRepository, { useClass: VacancyRepository });
container.register<IInterviewRepository>(TOKENS.IInterviewRepository, { useClass: InterviewRepository });

container.register<IDataImportService>(TOKENS.IDataImportService, { useClass: DataImportService });

export { container };