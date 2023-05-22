/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-relative-packages */
import { describe, it } from '@jest/globals';
import client from '../apolloClient';
import dataSource from '../../../server/src/db';
import WaitingRoom from '../../../server/src/entity/WaitingRoom';
import Counter from '../../../server/src/entity/Counter';
import Service from '../../../server/src/entity/Service';
import { CREATE_WAITINGROOM, DELETE_WAITINGROOM, UPDATE_WAITINGROOM } from '../graphQL/mutations/waitingRoomMutations';
import { GET_ALL_WAITINGROOMS, GET_ONE_WAITINGROOM } from '../graphQL/query/waitingRoomQuery';

const counterInput = { name: 'Counter1' };
const updateInput = { name: 'Update' };
const waitingRoomInput = { name: 'Wait1' };
const serviceInput = {
  name: 'Service1',
  acronym: 'SV1',
  isOpen: false,
  color: '#ffffff',
};

describe('WaitingRoom Resolver', () => {
  describe('Create waitingRoom', () => {
    describe('Success cases', () => {
      it('1. should create a waitingRoom', async () => {
        const res = await client.mutate({
          mutation: CREATE_WAITINGROOM,
          variables: {
            data: {
              ...waitingRoomInput,
            },
          },
        });

        expect(res.data?.createWaitingRoom).toHaveProperty('id');
        expect(res.data?.createWaitingRoom).toHaveProperty('name', 'Wait1');
      });
    });
  });

  describe('Get All WaitingRoom', () => {
    describe('Success cases', () => {
      it('1. should get all waitingRooms', async () => {
        for (let i = 0; i < 2; i += 1) {
          await dataSource.getRepository(WaitingRoom).save({
            name: `Wait${i + 1}`,
          });
        }

        const res = await client.query({
          query: GET_ALL_WAITINGROOMS,
          fetchPolicy: 'no-cache',
        });

        expect(res.data?.getAllWaitingRooms.length).toBe(2);
        expect(res.data?.getAllWaitingRooms[0]).toHaveProperty('id');
        expect(res.data?.getAllWaitingRooms[0]).toHaveProperty('name', 'Wait1');

        expect(res.data?.getAllWaitingRooms[1]).toHaveProperty('id');
        expect(res.data?.getAllWaitingRooms[1]).toHaveProperty('name', 'Wait2');
      });
      it('2. should get all waitingRooms with counter and service', async () => {
        const waitingRoom1 = await dataSource.getRepository(WaitingRoom).save({ name: 'Wait1' });
        const waitingRoom2 = await dataSource.getRepository(WaitingRoom).save({ name: 'Wait2' });

        const service = await dataSource.getRepository(Service).save({
          ...serviceInput,
          waitingRoom: { id: waitingRoom1.id },
        });

        const counter = await dataSource.getRepository(Counter).save({
          ...counterInput,
          waitingRoom: { id: waitingRoom2.id },
        });

        const res = await client.query({
          query: GET_ALL_WAITINGROOMS,
          fetchPolicy: 'no-cache',
        });

        expect(res.data?.getAllWaitingRooms.length).toBe(2);
        expect(res.data?.getAllWaitingRooms[0]).toHaveProperty('id');
        expect(res.data?.getAllWaitingRooms[0]).toHaveProperty('name', 'Wait1');
        expect(res.data?.getAllWaitingRooms[0].services[0]).toHaveProperty('id', service.id);

        expect(res.data?.getAllWaitingRooms[1]).toHaveProperty('id');
        expect(res.data?.getAllWaitingRooms[1]).toHaveProperty('name', 'Wait2');
        expect(res.data?.getAllWaitingRooms[1].counters[0]).toHaveProperty('id', counter.id);
      });
      it('3. should get no waitingRoom', async () => {
        const res = await client.query({
          query: GET_ALL_WAITINGROOMS,
          fetchPolicy: 'no-cache',
        });
        expect(res.data?.getAllWaitingRooms).toBeDefined();
        expect(res.data?.getAllWaitingRooms.length).toBe(0);
      });
    });
  });
  describe('Get One WaintingRoom By Id', () => {
    describe('Success cases', () => {
      it('1. should get a waitingRoom', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

        const res = await client.query({
          query: GET_ONE_WAITINGROOM,
          fetchPolicy: 'no-cache',
          variables: {
            getOneWaitingRoomId: waitingRoom.id,
          },
        });

        expect(res.data?.getOneWaitingRoom).toHaveProperty('id');
        expect(res.data?.getOneWaitingRoom).toHaveProperty('name', 'Wait1');
      });
      it('2. should get a waitingRoom with counters and services', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
        const counter = await dataSource.getRepository(Counter).save({
          ...counterInput,
          waitingRoom: { id: waitingRoom.id },
        });

        const service = await dataSource.getRepository(Service).save({
          ...serviceInput,
          waitingRoom: { id: waitingRoom.id },
        });

        const res = await client.query({
          query: GET_ONE_WAITINGROOM,
          fetchPolicy: 'no-cache',
          variables: {
            getOneWaitingRoomId: waitingRoom.id,
          },
        });

        expect(res.data?.getOneWaitingRoom).toHaveProperty('id');
        expect(res.data?.getOneWaitingRoom).toHaveProperty('name', 'Wait1');
        expect(res.data?.getOneWaitingRoom.services[0]).toHaveProperty('id', service.id);
        expect(res.data?.getOneWaitingRoom.counters[0]).toHaveProperty('id', counter.id);
      });

      describe('Error cases', () => {
        it('1. should not work without id', async () => {
          await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

          try {
            await client.query({
              query: GET_ONE_WAITINGROOM,
              fetchPolicy: 'no-cache',
              variables: {
                getOneWaitingRoomId: null,
              },
            });
            expect(true).toBe(false);
          } catch (e) {
            expect(e).toBeDefined();
            expect(e.graphQLErrors).toBeDefined();
            expect(e.graphQLErrors[0].message).toMatch(
              'Variable "$getOneWaitingRoomId" of non-null type "Int!" must not be null.',
            );
          }
        });
        it('2. should not found counter with wrong id', async () => {
          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

          try {
            await client.query({
              query: GET_ONE_WAITINGROOM,
              fetchPolicy: 'no-cache',
              variables: {
                getOneWaitingRoomId: waitingRoom.id + 1,
              },
            });
            expect(true).toBe(false);
          } catch (e) {
            expect(e).toBeDefined();
            expect(e.graphQLErrors).toBeDefined();
            expect(e.graphQLErrors[0].message).toMatch('WaitingRoom not found');
          }
        });
      });
    });
  });
  describe('Update WaitingRoom', () => {
    describe('Success cases', () => {
      it('1. should update a waitingRoom', async () => {
        const waitingRoomToUpdate = await dataSource.getRepository(WaitingRoom).save(
          waitingRoomInput,
        );

        const res = await client.mutate({
          mutation: UPDATE_WAITINGROOM,
          variables: {
            data: { ...updateInput },
            updateWaitingRoomId: waitingRoomToUpdate.id,
          },
        });

        expect(res.data?.updateWaitingRoom).toHaveProperty('id');
        expect(res.data?.updateWaitingRoom).toHaveProperty('name', 'Update');
      });

      describe('Error cases', () => {
        it('1. should fail without id', async () => {
          try {
            await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

            await client.mutate({
              mutation: UPDATE_WAITINGROOM,
              variables: {
                data: { ...updateInput },
                updateWaitingRoomId: null,
              },
            });
            expect(true).toBe(false);
          } catch (e) {
            expect(e).toBeDefined();
            expect(e.graphQLErrors).toBeDefined();
            expect(e.graphQLErrors[0].message).toMatch(
              'Variable "$updateWaitingRoomId" of non-null type "Int!" must not be null.',
            );
          }
        });
        it('2. should throw a not found waitingRoom error', async () => {
          try {
            const waitingRoomToUpdate = await dataSource.getRepository(WaitingRoom).save(
              waitingRoomInput,
            );

            await client.mutate({
              mutation: UPDATE_WAITINGROOM,
              variables: {
                data: { ...updateInput },
                updateWaitingRoomId: waitingRoomToUpdate.id + 1,
              },
            });
            expect(true).toBe(false);
          } catch (e) {
            expect(e).toBeDefined();
            expect(e.graphQLErrors).toBeDefined();
            expect(e.graphQLErrors[0].message).toMatch('WaitingRoom not found');
          }
        });
      });
    });
  });
  describe('Delete WaitingRoom', () => {
    describe('Success cases', () => {
      it('1. should delete a waitingRoom', async () => {
        const waitingRoomToDelete = await dataSource.getRepository(WaitingRoom).save(
          waitingRoomInput,
        );

        const res = await client.mutate({
          mutation: DELETE_WAITINGROOM,
          variables: {
            deleteWaitingRoomId: waitingRoomToDelete.id,
          },
        });
        expect(res.data).toHaveProperty('deleteWaitingRoom', true);
      });
    });
    describe('Error cases', () => {
      it('1. should fail whitout id', async () => {
        try {
          await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

          await client.mutate({
            mutation: DELETE_WAITINGROOM,
            variables: {
              deleteWaitingRoomId: null,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$deleteWaitingRoomId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should throw a not found error', async () => {
        try {
          const waitingRoomToDelete = await dataSource.getRepository(WaitingRoom).save(
            waitingRoomInput,
          );

          await client.mutate({
            mutation: DELETE_WAITINGROOM,
            variables: {
              deleteWaitingRoomId: waitingRoomToDelete.id + 1,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('Waiting room not found');
        }
      });
    });
  });
});
