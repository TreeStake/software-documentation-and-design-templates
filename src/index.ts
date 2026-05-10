import 'reflect-metadata';
import * as path from 'path';
import express from 'express';
import { appDataSource } from './dal/data-source';
import { container } from './container';
import { TOKENS } from './tokens';

import type { IDataImportService } from './bll/interfaces/IDataImportService';
import { VacancyController } from './presentation/controllers/VacancyController';
import { CandidateController } from './presentation/controllers/CandidateController';
import { RecruiterController } from './presentation/controllers/RecruiterController';
import { InterviewController } from './presentation/controllers/InterviewController';
import { InterviewResultController } from './presentation/controllers/InterviewResultController';

async function bootstrap() {
    try {
        await appDataSource.initialize();
        console.log('Database initialized');

        const dataImportService = container.resolve<IDataImportService>(TOKENS.IDataImportService);
        const csvPath = path.resolve(__dirname, '../data/seed_data.csv');
        try { await dataImportService.importFromCsv(csvPath); } catch (e) {}

        const app = express();
        app.use((req, res, next) => {
            console.log(`>>> [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
            next();
        });
        app.use(express.json());
        app.use(express.static(path.join(__dirname, '../public')));

        const vc  = container.resolve<VacancyController>(TOKENS.VacancyController);
        const cc  = container.resolve<CandidateController>(TOKENS.CandidateController);
        const rc  = container.resolve<RecruiterController>(TOKENS.RecruiterController);
        const ic  = container.resolve<InterviewController>(TOKENS.InterviewController);
        const irc = container.resolve<InterviewResultController>(TOKENS.InterviewResultController);

        app.get('/api/vacancies', vc.getAll.bind(vc));
        app.post('/api/vacancies', vc.create.bind(vc));
        app.post('/api/vacancies/:id', vc.update.bind(vc));
        app.delete('/api/vacancies/:id', vc.delete.bind(vc));

        app.get('/api/candidates', cc.getAll.bind(cc));
        app.post('/api/candidates', cc.create.bind(cc));
        app.post('/api/candidates/:id', cc.update.bind(cc));
        app.delete('/api/candidates/:id', cc.delete.bind(cc));

        app.get('/api/recruiters', rc.getAll.bind(rc));
        app.post('/api/recruiters', rc.create.bind(rc));
        app.post('/api/recruiters/:id', rc.update.bind(rc));
        app.delete('/api/recruiters/:id', rc.delete.bind(rc));

        app.get('/api/interviews', ic.getAll.bind(ic));
        app.post('/api/interviews', ic.create.bind(ic));
        app.post('/api/interviews/:id', ic.update.bind(ic));
        app.delete('/api/interviews/:id', ic.delete.bind(ic));

        app.get('/api/interview-results', irc.getAll.bind(irc));
        app.post('/api/interview-results', irc.create.bind(irc));
        app.post('/api/interview-results/:id', irc.update.bind(irc));
        app.delete('/api/interview-results/:id', irc.delete.bind(irc));

        const PORT = 3000;
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

    } catch (error) {
        console.error('Error during bootstrap:', error);
    }
}

bootstrap();