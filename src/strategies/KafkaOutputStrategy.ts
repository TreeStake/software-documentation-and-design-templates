import { IOutputStrategy } from './IOutputStrategy';
import { RevenueRecord, recordToJson } from '../models/RevenueRecord';

export interface KafkaOutputConfig {
  brokers: string[];
  topic: string;
  clientId?: string;
  batchSize?: number;
}

export class KafkaOutputStrategy implements IOutputStrategy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private kafka: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private producer: any = null;
  private readonly config: Required<KafkaOutputConfig>;
  private messageCount = 0;

  constructor(config: KafkaOutputConfig) {
    this.config = {
      brokers: config.brokers,
      topic: config.topic,
      clientId: config.clientId ?? 'revenue-budget-producer',
      batchSize: config.batchSize ?? 100,
    };
  }

  async connect(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Kafka: any;
    try {
      const kafkaModule = await import('kafkajs');
      Kafka = kafkaModule.Kafka;
    } catch {
      throw new Error(
        '[KafkaOutputStrategy] Бібліотека kafkajs не встановлена.\n' +
        'Виконайте: npm install kafkajs',
      );
    }

    this.kafka = new Kafka({
      clientId: this.config.clientId,
      brokers: this.config.brokers,
    });

    this.producer = this.kafka.producer();
    await this.producer.connect();

    console.log(
      `[Kafka] З'єднання встановлено. ` +
      `Брокери: ${this.config.brokers.join(', ')} | Топік: ${this.config.topic}`,
    );
  }

  async write(record: RevenueRecord): Promise<void> {
    if (!this.producer) {
      throw new Error('[KafkaOutputStrategy] Producer не ініціалізований. Викличте connect() спочатку.');
    }

    await this.producer.send({
      topic: this.config.topic,
      messages: [
        {
          key: `${record.bfy}-${record.rsrc}-${record.ftyp}`,
          value: recordToJson(record),
        },
      ],
    });

    this.messageCount++;
  }

  async writeBatch(records: RevenueRecord[]): Promise<void> {
    if (!this.producer) {
      throw new Error('[KafkaOutputStrategy] Producer не ініціалізований. Викличте connect() спочатку.');
    }

    for (let i = 0; i < records.length; i += this.config.batchSize) {
      const batch = records.slice(i, i + this.config.batchSize);

      await this.producer.send({
        topic: this.config.topic,
        messages: batch.map((r) => ({
          key: `${r.bfy}-${r.rsrc}-${r.ftyp}`,
          value: recordToJson(r),
        })),
      });

      this.messageCount += batch.length;
      console.log(`[Kafka] Надіслано ${this.messageCount} / ${records.length} повідомлень...`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
    }
    console.log(
      `[Kafka] З'єднання закрито. Всього надіслано повідомлень: ${this.messageCount}`,
    );
  }
}
