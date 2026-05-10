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
import { VacancyController } from './presentation/controllers/VacancyController';
import { CandidateController } from './presentation/controllers/CandidateController';
import { RecruiterController } from './presentation/controllers/RecruiterController';
import { InterviewController } from './presentation/controllers/InterviewController';
import { InterviewResultRepository } from './dal/repositories/InterviewResultRepository';
import { IInterviewResultRepository } from './dal/interfaces/IInterviewResultRepository';
import { InterviewResultController } from './presentation/controllers/InterviewResultController';




container.register<ICsvReader>(TOKENS.ICsvReader, { useClass: CsvReader });
container.register<ICandidateRepository>(TOKENS.ICandidateRepository, { useClass: CandidateRepository });
container.register<IRecruiterRepository>(TOKENS.IRecruiterRepository, { useClass: RecruiterRepository });
container.register<IVacancyRepository>(TOKENS.IVacancyRepository, { useClass: VacancyRepository });
container.register<IInterviewRepository>(TOKENS.IInterviewRepository, { useClass: InterviewRepository });

container.register<IDataImportService>(TOKENS.IDataImportService, { useClass: DataImportService });

container.register(TOKENS.VacancyController, { useClass: VacancyController });
container.register(TOKENS.CandidateController, { useClass: CandidateController });
container.register(TOKENS.RecruiterController, { useClass: RecruiterController });
container.register(TOKENS.InterviewController, { useClass: InterviewController });

container.register<IInterviewResultRepository>(TOKENS.IInterviewResultRepository, { useClass: InterviewResultRepository });
container.register(TOKENS.InterviewResultController, { useClass: InterviewResultController });



export { container };