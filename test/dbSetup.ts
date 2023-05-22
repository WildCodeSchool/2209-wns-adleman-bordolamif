// eslint-disable-next-line
import db from '../server/src/db';

// https://blog.tooljet.com/clearing-tables-before-each-test-nestjs-typeorm/
// https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
async function clearDB() {
  const entities = db.entityMetadatas;
  const entityOrder = [
    'Ticket',
    'Counter',
    'User',
    'WaitingRoom',
    'Service',
  ];
  const orderedEntities = entities.sort((a, b) => {
    const aIndex = entityOrder.indexOf(a.name);
    const bIndex = entityOrder.indexOf(b.name);
    return aIndex - bIndex;
  });
  for (const entity of orderedEntities) {
    // eslint-disable-next-line no-await-in-loop
    await db.getRepository(entity.name).delete({});
  }
  return Promise.resolve();
}

// init db before all tests
beforeAll(async () => {
  await db.initialize();
});

// clear db before each tests
beforeEach(async () => {
  await clearDB();
});

// close db connection after all tests
afterAll(async () => {
  await db.destroy();
});
