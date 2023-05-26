/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-relative-packages */
import { describe, it } from '@jest/globals';
import client from '../apolloClient';
import dataSource from '../../../server/src/db';
import WaitingRoom from '../../../server/src/entity/WaitingRoom';
import { CREATE_COUNTER, DELETE_COUNTER, UPDATE_COUNTER } from '../graphQL/mutations/counterMutations';
import { GET_ALL_COUNTERS, GET_ONE_COUNTER } from '../graphQL/query/counterQuery';
import Counter from '../../../server/src/entity/Counter';
import { getJWTFor } from '../utils';
import { RoleEnum } from '../../../server/src/utils/enums/RoleEnum';

const counterInput = { name: 'Counter1' };
const updateInput = { name: 'Update' };
const waitingRoomInput = { name: 'Wait1' };
const updateWaitingRoomInput = { name: 'Update' };
const admin = {
  firstname: 'test', lastname: 'test', email: 'admin@test.com', role: RoleEnum.ADMINISTRATEUR,
};

describe('Counter Resolver', () => {
  describe('Create Counter', () => {
    describe('Success cases', () => {
      it('1. should create a counter when logged in as admin', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
        const token = await getJWTFor(admin);

        const res = await client.mutate({
          mutation: CREATE_COUNTER,
          variables: {
            data: {
              ...counterInput,
              waitingRoom: { id: waitingRoom.id },
            },
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        expect(res.data?.createCounter).toHaveProperty('id');
        expect(res.data?.createCounter).toHaveProperty('name', 'Counter1');
        expect(res.data?.createCounter.waitingRoom).toHaveProperty('id', waitingRoom.id);
      });
    });
    describe('Error cases', () => {
      it('1. should throw a waiting room not found error', async () => {
        try {
          const token = await getJWTFor(admin);
          await client.mutate({
            mutation: CREATE_COUNTER,
            variables: {
              data: {
                ...counterInput,
                waitingRoom: { id: 1 },
              },
            },
            context: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors.length).toBeGreaterThan(0);
          expect(e.graphQLErrors[0].message).toMatch(/Could not find any entity of type "WaitingRoom" matching/);
        }
      });
    });
  });
  describe('Get All Counters', () => {
    describe('Success cases', () => {
      it('1. should get all counters', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

        for (let i = 0; i < 2; i += 1) {
          await dataSource.getRepository(Counter).save({
            name: `Counter${i + 1}`,
            waitingRoom: { id: waitingRoom.id },
          });
        }

        const res = await client.query({
          query: GET_ALL_COUNTERS,
          fetchPolicy: 'no-cache',
        });

        expect(res.data?.getAllCounters.length).toBe(2);
        expect(res.data?.getAllCounters[0]).toHaveProperty('id');
        expect(res.data?.getAllCounters[0]).toHaveProperty('name', 'Counter1');
        expect(res.data?.getAllCounters[0].waitingRoom).toHaveProperty('id', waitingRoom.id);

        expect(res.data?.getAllCounters[1]).toHaveProperty('id');
        expect(res.data?.getAllCounters[1]).toHaveProperty('name', 'Counter2');
        expect(res.data?.getAllCounters[1].waitingRoom).toHaveProperty('id', waitingRoom.id);
      });
      it('2. should get no counter', async () => {
        const res = await client.query({
          query: GET_ALL_COUNTERS,
          fetchPolicy: 'no-cache',
        });
        expect(res.data?.getAllCounters).toBeDefined();
        expect(res.data?.getAllCounters.length).toBe(0);
      });
    });
  });
  describe('Get One Service By Id', () => {
    describe('Success cases', () => {
      it('1. should get a service', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
        const counter = await dataSource.getRepository(Counter).save({
          ...counterInput,
          waitingRoom: { id: waitingRoom.id },
        });

        const res = await client.query({
          query: GET_ONE_COUNTER,
          fetchPolicy: 'no-cache',
          variables: {
            getOneCounterId: counter.id,
          },
        });

        expect(res.data?.getOneCounter).toHaveProperty('id');
        expect(res.data?.getOneCounter).toHaveProperty('name', 'Counter1');
        expect(res.data?.getOneCounter.waitingRoom).toHaveProperty('id', waitingRoom.id);
      });

      describe('Error cases', () => {
        it('1. should not work without id', async () => {
          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
          await dataSource.getRepository(Counter).save({
            ...counterInput,
            waitingRoom: { id: waitingRoom.id },
          });
          try {
            await client.query({
              query: GET_ONE_COUNTER,
              fetchPolicy: 'no-cache',
              variables: {
                getOneCounterId: null,
              },
            });
            expect(true).toBe(false);
          } catch (e) {
            expect(e).toBeDefined();
            expect(e.graphQLErrors).toBeDefined();
            expect(e.graphQLErrors[0].message).toMatch(
              'Variable "$getOneCounterId" of non-null type "Int!" must not be null.',
            );
          }
        });
        it('2. should not found counter with wrong id', async () => {
          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
          const counter = await dataSource.getRepository(Counter).save({
            ...counterInput,
            waitingRoom: { id: waitingRoom.id },
          });
          try {
            await client.query({
              query: GET_ONE_COUNTER,
              fetchPolicy: 'no-cache',
              variables: {
                getOneCounterId: counter.id + 1,
              },
            });
            expect(true).toBe(false);
          } catch (e) {
            expect(e).toBeDefined();
            expect(e.graphQLErrors).toBeDefined();
            expect(e.graphQLErrors[0].message).toMatch('Counter not found');
          }
        });
      });
    });
  });
  describe('Update Counter', () => {
    describe('Success cases', () => {
      it('1. should update a counter when logged in as admin', async () => {
        const token = await getJWTFor(admin);
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
        const counterToUpdate = await dataSource.getRepository(Counter).save({
          ...counterInput,
          waitingRoom: { id: waitingRoom.id },
        });
        const res = await client.mutate({
          mutation: UPDATE_COUNTER,
          variables: {
            data: { ...updateInput, waitingRoom: { id: waitingRoom.id } },
            updateCounterId: counterToUpdate.id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        expect(res.data?.updateCounter).toHaveProperty('id');
        expect(res.data?.updateCounter).toHaveProperty('name', 'Update');
        expect(res.data?.updateCounter.waitingRoom).toHaveProperty('id', waitingRoom.id);
      });
      it('2. should add a waitingRoom to a counter', async () => {
        const token = await getJWTFor(admin);
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
        const waitingRoomBis = await dataSource.getRepository(WaitingRoom).save(
          updateWaitingRoomInput,
        );

        const counterToUpdate = await dataSource.getRepository(Counter).save({
          ...counterInput,
          waitingRoom: { id: waitingRoom.id },
        });
        const res = await client.mutate({
          mutation: UPDATE_COUNTER,
          variables: {
            data: { ...counterInput, waitingRoom: { id: waitingRoomBis.id } },
            updateCounterId: counterToUpdate.id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        expect(res.data?.updateCounter).toHaveProperty('id');
        expect(res.data?.updateCounter).toHaveProperty('name', 'Counter1');
        expect(res.data?.updateCounter.waitingRoom).toHaveProperty('id', waitingRoomBis.id);
      });
    });
    describe('Error cases', () => {
      it('1. should fail without id', async () => {
        try {
          const token = await getJWTFor(admin);
          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
          await dataSource.getRepository(Counter).save({
            ...counterInput,
            waitingRoom: { id: waitingRoom.id },
          });

          await client.mutate({
            mutation: UPDATE_COUNTER,
            variables: {
              data: { ...updateInput, waitingRoom: { id: waitingRoom.id } },
              updateCounterId: null,
            },
            context: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$updateCounterId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should throw a not found service error', async () => {
        try {
          const token = await getJWTFor(admin);
          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
          const counterToUpdate = await dataSource.getRepository(Counter).save({
            ...counterInput,
            waitingRoom: { id: waitingRoom.id },
          });
          await client.mutate({
            mutation: UPDATE_COUNTER,
            variables: {
              data: { ...updateInput },
              updateCounterId: counterToUpdate.id + 1,
            },
            context: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('Counter not found');
        }
      });
      it('3. should throw a not found waitingRoom error', async () => {
        try {
          const token = await getJWTFor(admin);
          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
          const counterToUpdate = await dataSource.getRepository(Counter).save({
            ...counterInput,
            waitingRoom: { id: waitingRoom.id },
          });

          await client.mutate({
            mutation: UPDATE_COUNTER,
            variables: {
              data: {
                ...updateInput, waitingRoom: { id: waitingRoom.id + 1 },
              },
              updateCounterId: counterToUpdate.id,
            },
            context: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(/Could not find any entity of type "WaitingRoom" matching/);
        }
      });
    });
  });
  describe('Delete Counter', () => {
    describe('Success cases', () => {
      it('1. should delete a counter', async () => {
        const token = await getJWTFor(admin);
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
        const counterToDelete = await dataSource.getRepository(Counter).save({
          ...counterInput,
          waitingRoom: { id: waitingRoom.id },
        });

        const res = await client.mutate({
          mutation: DELETE_COUNTER,
          variables: {
            deleteCounterId: counterToDelete.id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        expect(res.data).toHaveProperty('deleteCounter', true);
      });
    });
    describe('Error cases', () => {
      it('1. should fail whitout id', async () => {
        try {
          const token = await getJWTFor(admin);
          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
          await dataSource.getRepository(Counter).save({
            ...counterInput,
            waitingRoom: { id: waitingRoom.id },
          });

          await client.mutate({
            mutation: DELETE_COUNTER,
            variables: {
              deleteCounterId: null,
            },
            context: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$deleteCounterId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should throw a not found error', async () => {
        try {
          const token = await getJWTFor(admin);
          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
          const counterToDelete = await dataSource.getRepository(Counter).save({
            ...counterInput,
            waitingRoom: { id: waitingRoom.id },
          });
          await client.mutate({
            mutation: DELETE_COUNTER,
            variables: {
              deleteCounterId: counterToDelete.id + 1,
            },
            context: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('Counter not found');
        }
      });
    });
  });
});
