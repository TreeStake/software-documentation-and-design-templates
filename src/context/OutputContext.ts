import { IOutputStrategy } from '../strategies/IOutputStrategy';
import { RevenueRecord } from '../models/RevenueRecord';

export class OutputContext {
  private strategy: IOutputStrategy;

  constructor(strategy: IOutputStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IOutputStrategy): void {
    this.strategy = strategy;
  }

  async connect(): Promise<void> {
    await this.strategy.connect();
  }

  async write(record: RevenueRecord): Promise<void> {
    await this.strategy.write(record);
  }

  async writeBatch(records: RevenueRecord[]): Promise<void> {
    await this.strategy.writeBatch(records);
  }

  async disconnect(): Promise<void> {
    await this.strategy.disconnect();
  }

  async writeAll(records: RevenueRecord[]): Promise<void> {
    await this.connect();
    await this.writeBatch(records);
    await this.disconnect();
  }
}
