/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-relative-packages */
import { describe, it } from '@jest/globals';
import client from '../apolloClient';
import Service from '../../../server/src/entity/Service';
import dataSource from '../../../server/src/db';
// import User from '../../../server/src/entity/User';
// import Ticket from '../../../server/src/entity/Ticket';
import WaitingRoom from '../../../server/src/entity/WaitingRoom';
import { CREATE_SERVICE, DELETE_SERVICE, UPDATE_SERVICE } from '../graphQL/mutations/serviceMutations';
import { GET_ALL_SERVICES, GET_ONE_SERVICE } from '../graphQL/query/serviceQuery';

const firstServiceInput = {
  name: 'Service1',
  acronym: 'SV1',
  isOpen: false,
  color: '#ffffff',
};

const secondServiceInput = {
  name: 'Service2',
  acronym: 'SV2',
  isOpen: false,
  color: '#eeeeee',
};

const updateInput = {
  name: 'Update',
  acronym: 'UPD',
  isOpen: true,
  color: '#000000',
};

const waitingRoomInput = { name: 'Wait1' };

describe('Service Resolver', () => {
  describe('Create Service', () => {
    describe('Success cases', () => {
      it('1. should create a ticket', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

        const res1 = await client.mutate({
          mutation: CREATE_SERVICE,
          variables: {
            data: {
              ...firstServiceInput,
            },
          },
        });
        const res2 = await client.mutate({
          mutation: CREATE_SERVICE,
          variables: {
            data: {
              ...secondServiceInput,
              waitingRoom: { id: waitingRoom.id },
            },
          },
        });
        expect(res1.data?.createService).toHaveProperty('id');
        expect(res1.data?.createService).toHaveProperty('name', 'Service1');
        expect(res1.data?.createService).toHaveProperty('acronym', 'SV1');
        expect(res1.data?.createService).toHaveProperty('isOpen', false);
        expect(res1.data?.createService).toHaveProperty('color', '#ffffff');

        expect(res2.data?.createService).toHaveProperty('id');
        expect(res2.data?.createService).toHaveProperty('name', 'Service2');
        expect(res2.data?.createService).toHaveProperty('acronym', 'SV2');
        expect(res2.data?.createService).toHaveProperty('isOpen', false);
        expect(res2.data?.createService).toHaveProperty('color', '#eeeeee');
        expect(res2.data?.createService.waitingRoom).toHaveProperty('id', waitingRoom.id);
      });
    });
    describe('Error cases', () => {
      it('1. should throw a waiting room not found error', async () => {
        try {
          await client.mutate({
            mutation: CREATE_SERVICE,
            variables: {
              data: {
                ...firstServiceInput,
                waitingRoom: { id: 1 },
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors.length).toBeGreaterThan(0);
          expect(e.graphQLErrors[0].message).toMatch('WaitingRoom not found');
        }
      });
    });
  });

  describe('Get All Services', () => {
    describe('Success cases', () => {
      it('1. should get all services', async () => {
        await dataSource.getRepository(Service).save(firstServiceInput);
        await dataSource.getRepository(Service).save(secondServiceInput);

        const res = await client.query({
          query: GET_ALL_SERVICES,
          fetchPolicy: 'no-cache',
        });

        expect(res.data?.getAllServices.length).toBe(2);
        expect(res.data?.getAllServices[0]).toHaveProperty('id');
        expect(res.data?.getAllServices[0]).toHaveProperty('name', 'Service1');
        expect(res.data?.getAllServices[0]).toHaveProperty('acronym', 'SV1');
        expect(res.data?.getAllServices[0]).toHaveProperty('isOpen', false);
        expect(res.data?.getAllServices[0]).toHaveProperty('color', '#ffffff');

        expect(res.data?.getAllServices[1]).toHaveProperty('id');
        expect(res.data?.getAllServices[1]).toHaveProperty('name', 'Service2');
        expect(res.data?.getAllServices[1]).toHaveProperty('acronym', 'SV2');
        expect(res.data?.getAllServices[1]).toHaveProperty('isOpen', false);
        expect(res.data?.getAllServices[1]).toHaveProperty('color', '#eeeeee');
      });
      it('2. should get no service', async () => {
        const res = await client.query({
          query: GET_ALL_SERVICES,
          fetchPolicy: 'no-cache',
        });
        expect(res.data?.getAllServices).toBeDefined();
        expect(res.data?.getAllServices.length).toBe(0);
      });
    });
  });
  describe('Get One Service By Id', () => {
    describe('Success cases', () => {
      it('1. should get a service', async () => {
        const service = await dataSource.getRepository(Service).save(firstServiceInput);

        const res = await client.query({
          query: GET_ONE_SERVICE,
          fetchPolicy: 'no-cache',
          variables: {
            getOneServiceId: service.id,
          },
        });

        expect(res.data?.getOneService).toHaveProperty('id');
        expect(res.data?.getOneService).toHaveProperty('name', 'Service1');
        expect(res.data?.getOneService).toHaveProperty('acronym', 'SV1');
        expect(res.data?.getOneService).toHaveProperty('isOpen', false);
        expect(res.data?.getOneService).toHaveProperty('color', '#ffffff');
      });
      it('2. should get a service with a waitingRoom', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

        const service = await dataSource.getRepository(Service).save({
          ...firstServiceInput,
          waitingRoom: { id: waitingRoom.id },
        });

        const res = await client.query({
          query: GET_ONE_SERVICE,
          fetchPolicy: 'no-cache',
          variables: {
            getOneServiceId: service.id,
          },
        });

        expect(res.data?.getOneService).toHaveProperty('id');
        expect(res.data?.getOneService).toHaveProperty('name', 'Service1');
        expect(res.data?.getOneService).toHaveProperty('acronym', 'SV1');
        expect(res.data?.getOneService).toHaveProperty('isOpen', false);
        expect(res.data?.getOneService).toHaveProperty('color', '#ffffff');
        expect(res.data?.getOneService.waitingRoom).toHaveProperty('id', waitingRoom.id);
      });
    });
    describe('Error cases', () => {
      it('1. should not work without id', async () => {
        await dataSource.getRepository(Service).save(firstServiceInput);

        try {
          await client.query({
            query: GET_ONE_SERVICE,
            fetchPolicy: 'no-cache',
            variables: {
              getOneServiceId: null,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$getOneServiceId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should not found service with wrong id', async () => {
        const service = await dataSource.getRepository(Service).save(firstServiceInput);
        try {
          await client.query({
            query: GET_ONE_SERVICE,
            fetchPolicy: 'no-cache',
            variables: {
              getOneServiceId: service.id + 1,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('Service not found');
        }
      });
    });
  });
  describe('Update Service', () => {
    describe('Success cases', () => {
      it('1. should update a service', async () => {
        const serviceToUpdate = await dataSource.getRepository(Service).save(firstServiceInput);

        const res = await client.mutate({
          mutation: UPDATE_SERVICE,
          variables: {
            data: { ...updateInput },
            updateServiceId: serviceToUpdate.id,
          },
        });

        expect(res.data?.updateService).toHaveProperty('id');
        expect(res.data?.updateService).toHaveProperty('name', 'Update');
        expect(res.data?.updateService).toHaveProperty('acronym', 'UPD');
        expect(res.data?.updateService).toHaveProperty('isOpen', true);
        expect(res.data?.updateService).toHaveProperty('color', '#000000');
      });
      it('2. should add an user to a service', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
        const serviceToUpdate = await dataSource.getRepository(Service).save(firstServiceInput);

        const res = await client.mutate({
          mutation: UPDATE_SERVICE,
          variables: {
            data: { ...updateInput, waitingRoom: { id: waitingRoom.id } },
            updateServiceId: serviceToUpdate.id,
          },
        });

        expect(res.data?.updateService).toHaveProperty('id');
        expect(res.data?.updateService).toHaveProperty('name', 'Update');
        expect(res.data?.updateService).toHaveProperty('acronym', 'UPD');
        expect(res.data?.updateService).toHaveProperty('isOpen', true);
        expect(res.data?.updateService).toHaveProperty('color', '#000000');
        expect(res.data?.updateService.waitingRoom).toHaveProperty('id', waitingRoom.id);
      });
    });
    describe('Error cases', () => {
      it('1. should fail without id', async () => {
        try {
          await dataSource.getRepository(Service).save(firstServiceInput);

          await client.mutate({
            mutation: UPDATE_SERVICE,
            variables: {
              data: { ...updateInput },
              updateServiceId: null,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$updateServiceId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should throw a not found service error', async () => {
        try {
          const serviceToUpdate = await dataSource.getRepository(Service).save(firstServiceInput);

          await client.mutate({
            mutation: UPDATE_SERVICE,
            variables: {
              data: { ...updateInput },
              updateServiceId: serviceToUpdate.id + 1,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('Service not found');
        }
      });
      it('3. should throw a not found waitingRoom error', async () => {
        try {
          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
          const serviceToUpdate = await dataSource.getRepository(Service).save(firstServiceInput);

          await client.mutate({
            mutation: UPDATE_SERVICE,
            variables: {
              data: {
                ...updateInput, waitingRoom: { id: waitingRoom.id + 1 },
              },
              updateServiceId: serviceToUpdate.id,
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
  describe('Delete Service', () => {
    describe('Success cases', () => {
      it('1. should delete a service', async () => {
        const serviceToDelete = await dataSource.getRepository(Service).save(firstServiceInput);

        const res = await client.mutate({
          mutation: DELETE_SERVICE,
          variables: {
            deleteServiceId: serviceToDelete.id,
          },
        });
        expect(res.data).toHaveProperty('deleteService', true);
      });
      it('2. should delete a service with a waitingRoom', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);
        const serviceToDelete = await dataSource.getRepository(Service).save({
          ...firstServiceInput,
          waitingRoom: { id: waitingRoom.id },
        });
        const res = await client.mutate({
          mutation: DELETE_SERVICE,
          variables: {
            deleteServiceId: serviceToDelete.id,
          },
        });
        expect(res.data).toHaveProperty('deleteService', true);
      });
    });
    describe('Error cases', () => {
      it('1. should fail whitout id', async () => {
        try {
          await dataSource.getRepository(Service).save(firstServiceInput);

          await client.mutate({
            mutation: DELETE_SERVICE,
            variables: {
              deleteServiceId: null,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$deleteServiceId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should throw a not found error', async () => {
        try {
          const serviceToDelete = await dataSource.getRepository(Service).save(firstServiceInput);

          await client.mutate({
            mutation: DELETE_SERVICE,
            variables: {
              deleteServiceId: serviceToDelete.id + 1,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('Service not found');
        }
      });
    });
  });
});
