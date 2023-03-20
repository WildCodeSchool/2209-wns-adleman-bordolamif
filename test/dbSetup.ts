// eslint-disable-next-line
import db from '../server/src/db';

// https://blog.tooljet.com/clearing-tables-before-each-test-nestjs-typeorm/
// https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
async function clearDB() {
  const entities = db.entityMetadatas;
  return await Promise.all(
    entities.map(async (entity) => await db.getRepository(entity.name).delete({})),
  );
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
