import { IOutputStrategy } from '../strategies/IOutputStrategy';
import { ConsoleOutputStrategy } from '../strategies/ConsoleOutputStrategy';
import { KafkaOutputStrategy } from '../strategies/KafkaOutputStrategy';
import { RedisOutputStrategy } from '../strategies/RedisOutputStrategy';
import { AppConfig } from '../config/AppConfig';

export function createStrategy(config: AppConfig): IOutputStrategy {
  const { type } = config.output;

  switch (type) {
    case 'console':
      return new ConsoleOutputStrategy(config.output.console ?? {});

    case 'kafka':
      if (!config.output.kafka) {
        throw new Error('Відсутня конфігурація Kafka у config.json (output.kafka)');
      }
      return new KafkaOutputStrategy(config.output.kafka);

    case 'redis':
      if (!config.output.redis) {
        throw new Error('Відсутня конфігурація Redis у config.json (output.redis)');
      }
      return new RedisOutputStrategy(config.output.redis);

    default:
      throw new Error(`Невідомий тип стратегії: "${type}"`);
  }
}
