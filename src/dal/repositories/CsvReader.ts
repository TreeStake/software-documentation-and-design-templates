import { injectable } from 'tsyringe';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { ICsvReader } from '../interfaces/ICsvReader';

@injectable()
export class CsvReader implements ICsvReader {
    async readFile(filePath: string): Promise<any[]> {
        const records: any[] = [];
        
        const parser = fs.createReadStream(filePath).pipe(
            parse({
                columns: true,
                skip_empty_lines: true,
                trim: true
            })
        );

        for await (const record of parser) {
            records.push(record);
        }
        
        return records;
    }
}