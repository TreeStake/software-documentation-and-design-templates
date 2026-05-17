import { RevenueRecord } from '../models/RevenueRecord';

export interface IOutputStrategy {
  connect(): Promise<void>;
  write(record: RevenueRecord): Promise<void>;
  writeBatch(records: RevenueRecord[]): Promise<void>;
  disconnect(): Promise<void>;
}
