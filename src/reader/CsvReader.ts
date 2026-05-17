import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { RevenueRecord, rowToRecord } from '../models/RevenueRecord';

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

export async function readCsv(
  filePath: string,
  skipHeader = true,
): Promise<RevenueRecord[]> {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`CSV файл не знайдено: ${absolutePath}`);
  }

  const records: RevenueRecord[] = [];
  let isFirstLine = true;

  const fileStream = fs.createReadStream(absolutePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;

    if (isFirstLine) {
      isFirstLine = false;
      if (skipHeader) continue;
    }

    const fields = parseCsvLine(line);

    if (fields.length !== 8) {
      console.warn(
        `[CsvReader] Пропущено рядок з неправильною кількістю стовпців (${fields.length}): ${line}`,
      );
      continue;
    }

    records.push(rowToRecord(fields));
  }

  return records;
}

export async function readCsvPaged(
  filePath: string,
  limit = 0,
  offset = 0,
): Promise<RevenueRecord[]> {
  const all = await readCsv(filePath);
  const sliced = offset > 0 ? all.slice(offset) : all;
  return limit > 0 ? sliced.slice(0, limit) : sliced;
}
