import * as fs from 'fs';
import * as path from 'path';

export type OutputType = 'console' | 'kafka' | 'redis';

export interface ConsoleConfig {
  showRowNumbers?: boolean;
  showHeader?: boolean;
  separator?: string;
}

export interface KafkaConfig {
  brokers: string[];
  topic: string;
  clientId?: string;
  batchSize?: number;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number;
  useList?: boolean;
  listKey?: string;
}

export interface OutputConfig {
  type: OutputType;
  console?: ConsoleConfig;
  kafka?: KafkaConfig;
  redis?: RedisConfig;
}

export interface AppConfig {
  csvFile: string;
  limit?: number;
  offset?: number;
  output: OutputConfig;
}

export function loadConfig(configPath: string): AppConfig {
  const absolutePath = path.resolve(configPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Конфігураційний файл не знайдено: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, 'utf8');

  let config: AppConfig;
  try {
    config = JSON.parse(raw) as AppConfig;
  } catch (err) {
    throw new Error(`Помилка парсингу config.json: ${(err as Error).message}`);
  }

  if (!config.csvFile) {
    throw new Error('config.json: відсутнє обов\'язкове поле "csvFile"');
  }
  if (!config.output?.type) {
    throw new Error('config.json: відсутнє обов\'язкове поле "output.type"');
  }

  const validTypes: OutputType[] = ['console', 'kafka', 'redis'];
  if (!validTypes.includes(config.output.type)) {
    throw new Error(
      `config.json: невідомий "output.type" = "${config.output.type}". ` +
      `Допустимі значення: ${validTypes.join(', ')}`,
    );
  }

  if (config.output.type === 'kafka' && !config.output.kafka?.brokers?.length) {
    throw new Error('config.json: для Kafka необхідно вказати "output.kafka.brokers"');
  }

  if (config.output.type === 'redis' && !config.output.redis?.host) {
    throw new Error('config.json: для Redis необхідно вказати "output.redis.host"');
  }

  return config;
}
