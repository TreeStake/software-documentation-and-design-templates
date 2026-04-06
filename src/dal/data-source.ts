import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';

import { Candidate } from './entities/Candidate';
import { Recruiter } from './entities/Recruiter';
import { Vacancy } from './entities/Vacancy';
import { Interview } from './entities/Interview';
import { InterviewResult } from './entities/InterviewResult';

export const appDataSource = new DataSource({
    type: 'better-sqlite3',
    database: path.resolve(__dirname, '../../data/recruiting.db'),
    synchronize: true,
    logging: false,
    entities: [Candidate, Recruiter, Vacancy, Interview, InterviewResult],
});