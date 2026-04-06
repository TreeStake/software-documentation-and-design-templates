import 'reflect-metadata';
import * as path from 'path';

import { appDataSource } from './dal/data-source';
import { container } from './container';
import { TOKENS } from './tokens';

import type { IDataImportService } from './bll/interfaces/IDataImportService';

async function bootstrap() {
    try {
        await appDataSource.initialize();

        const dataImportService = container.resolve<IDataImportService>(TOKENS.IDataImportService);

        const csvPath = path.resolve(__dirname, '../data/seed_data.csv');
        
        const importedInterviewsCount = await dataImportService.importFromCsv(csvPath);

        console.log(`Saved ${importedInterviewsCount} interviews`);

    } catch (error) {
        console.error(error);
    } finally {
        if (appDataSource.isInitialized) {
            await appDataSource.destroy();
            console.log('Close DB');
        }
    }
}

bootstrap();