import * as path from 'path';
import { loadConfig } from './config/AppConfig';
import { readCsvPaged } from './reader/CsvReader';
import { OutputContext } from './context/OutputContext';
import { createStrategy } from './factory/StrategyFactory';

async function main(): Promise<void> {
  const configPath = path.resolve(__dirname, '..', 'config.json');
  const config = loadConfig(configPath);

  console.log('\n📋 Конфігурація завантажена:');
  console.log(`   CSV файл  : ${config.csvFile}`);
  console.log(`   Стратегія : ${config.output.type.toUpperCase()}`);
  console.log(`   Ліміт     : ${config.limit ? config.limit + ' записів' : 'усі записи'}`);
  console.log(`   Зміщення  : ${config.offset ?? 0}\n`);

  const strategy = createStrategy(config);
  const context = new OutputContext(strategy);

  const csvPath = path.resolve(__dirname, '..', config.csvFile);
  console.log(`📂 Читання файлу: ${csvPath}`);

  const records = await readCsvPaged(
    csvPath,
    config.limit ?? 0,
    config.offset ?? 0,
  );

  console.log(`✅ Прочитано записів: ${records.length}\n`);

  await context.writeAll(records);

  console.log('\n🎉 Завдання виконано успішно.');
}

main().catch((err: Error) => {
  console.error('\n❌ Критична помилка:', err.message);
  process.exit(1);
});
