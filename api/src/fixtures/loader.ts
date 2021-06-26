import * as path from 'path';
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli/dist';
import { createConnection, getRepository } from 'typeorm';
import { config } from './ormconfig';

// https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md#installing-cli
// Typeorm requires you have both typeorm and ts-node installed globally for the cli to work

const loadFixtures = async (fixturesPath: string) => {
  let connection;

  try {
    console.log(`using connection: ${JSON.stringify(config)}`);
    connection = await createConnection(config);
    await connection.synchronize(true);

    const loader = new Loader();
    loader.load(path.resolve(fixturesPath));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);
      await getRepository(entity.constructor.name).save(entity);
    }
  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

loadFixtures('./dist/fixtures')
  .then(() => {
    console.log('Fixtures are successfully loaded.');
  })
  .catch((err) => console.log(err));
