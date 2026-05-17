import { IOutputStrategy } from './IOutputStrategy';
import { RevenueRecord, recordToString } from '../models/RevenueRecord';

export interface ConsoleOutputConfig {
  showRowNumbers?: boolean;
  separator?: string;
  showHeader?: boolean;
}

export class ConsoleOutputStrategy implements IOutputStrategy {
  private rowCounter = 0;
  private readonly config: Required<ConsoleOutputConfig>;

  constructor(config: ConsoleOutputConfig = {}) {
    this.config = {
      showRowNumbers: config.showRowNumbers ?? true,
      separator: config.separator ?? '',
      showHeader: config.showHeader ?? true,
    };
  }

  async connect(): Promise<void> {
    if (this.config.showHeader) {
      console.log('='.repeat(100));
      console.log('  REVENUE BUDGET DATA — Console Output Strategy');
      console.log('='.repeat(100));
    }
  }

  async write(record: RevenueRecord): Promise<void> {
    this.rowCounter++;
    const line = recordToString(record);

    if (this.config.showRowNumbers) {
      const num = String(this.rowCounter).padStart(5, ' ');
      console.log(`${num}. ${line}`);
    } else {
      console.log(line);
    }

    if (this.config.separator) {
      console.log(this.config.separator);
    }
  }

  async writeBatch(records: RevenueRecord[]): Promise<void> {
    for (const record of records) {
      await this.write(record);
    }
  }

  async disconnect(): Promise<void> {
    console.log('='.repeat(100));
    console.log(`  Виведено записів: ${this.rowCounter}`);
    console.log('='.repeat(100));
  }
}
