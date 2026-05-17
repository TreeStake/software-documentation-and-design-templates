import { IOutputStrategy } from './IOutputStrategy';
import { RevenueRecord, recordToJson } from '../models/RevenueRecord';

export interface RedisOutputConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number;
  useList?: boolean;
  listKey?: string;
}

export class RedisOutputStrategy implements IOutputStrategy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null;
  private readonly config: Required<RedisOutputConfig>;
  private writeCount = 0;

  constructor(config: RedisOutputConfig) {
    this.config = {
      host: config.host,
      port: config.port,
      password: config.password ?? '',
      db: config.db ?? 0,
      keyPrefix: config.keyPrefix ?? 'revenue_budget',
      ttl: config.ttl ?? 0,
      useList: config.useList ?? false,
      listKey: config.listKey ?? 'revenue_budget:records',
    };
  }

  async connect(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Redis: any;
    try {
      const redisModule = await import('ioredis');
      Redis = redisModule.default;
    } catch {
      throw new Error(
        '[RedisOutputStrategy] Бібліотека ioredis не встановлена.\n' +
        'Виконайте: npm install ioredis',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      host: this.config.host,
      port: this.config.port,
      db: this.config.db,
    };
    if (this.config.password) {
      options.password = this.config.password;
    }

    this.client = new Redis(options);

    const pong = await this.client.ping();
    if (pong !== 'PONG') {
      throw new Error('[RedisOutputStrategy] Redis не відповідає на PING.');
    }

    console.log(
      `[Redis] З'єднання встановлено. ` +
      `${this.config.host}:${this.config.port} | DB: ${this.config.db} | ` +
      `Режим: ${this.config.useList ? 'List' : 'Key-Value'}`,
    );
  }

  private buildKey(): string {
    return `${this.config.keyPrefix}:${this.writeCount + 1}`;
  }

  async write(record: RevenueRecord): Promise<void> {
    if (!this.client) {
      throw new Error('[RedisOutputStrategy] Клієнт не ініціалізований. Викличте connect() спочатку.');
    }

    const json = recordToJson(record);

    if (this.config.useList) {
      await this.client.rpush(this.config.listKey, json);
    } else {
      const key = this.buildKey();
      if (this.config.ttl > 0) {
        await this.client.set(key, json, 'EX', this.config.ttl);
      } else {
        await this.client.set(key, json);
      }
    }

    this.writeCount++;
  }

  async writeBatch(records: RevenueRecord[]): Promise<void> {
    if (!this.client) {
      throw new Error('[RedisOutputStrategy] Клієнт не ініціалізований. Викличте connect() спочатку.');
    }

    const pipeline = this.client.pipeline();

    for (const record of records) {
      const json = recordToJson(record);
      if (this.config.useList) {
        pipeline.rpush(this.config.listKey, json);
      } else {
        const key = this.buildKey();
        if (this.config.ttl > 0) {
          pipeline.set(key, json, 'EX', this.config.ttl);
        } else {
          pipeline.set(key, json);
        }
      }
    }

    await pipeline.exec();
    this.writeCount += records.length;
    console.log(`[Redis] Записано ${this.writeCount} записів.`);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
    console.log(
      `[Redis] З'єднання закрито. Всього записано: ${this.writeCount} записів.`,
    );
  }
}
