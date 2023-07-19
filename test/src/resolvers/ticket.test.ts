/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-relative-packages */
import { describe, it } from '@jest/globals';
import client from '../apolloClient';
import Service from '../../../server/src/entity/Service';
import dataSource from '../../../server/src/db';
import { CREATE_TICKET, DELETE_TICKET, UPDATE_TICKET } from '../graphQL/mutations/ticketMutations';
import User from '../../../server/src/entity/User';
import { GET_ALL_TICKETS, GET_ALL_TICKETS_FOR_WAITING_ROOM, GET_ONE_TICKET } from '../graphQL/query/ticketQuery';
import Ticket from '../../../server/src/entity/Ticket';
import WaitingRoom from '../../../server/src/entity/WaitingRoom';
import { getJWTFor } from '../utils';
import { RoleEnum } from '../../../server/src/utils/enums/RoleEnum';

const serviceInput = {
  name: 'Service1',
  acronym: 'SV1',
  isOpen: false,
  color: '#ffffff',
};

const fakeServiceInput = {
  name: 'Service2',
  acronym: 'SV2',
  isOpen: false,
  color: '#eeeeee',
};

const ticketInput = {
  name: 'SV1-001',
  isFirstTime: false,
};

const clientInput = {
  role: 3,
  lastname: 'User',
  firstname: 'Client',
  email: 'client@test.fr',
  password: 'P4$$W0rd',
};

const updateInput = {
  name: 'SV1-001',
  isFirstTime: true,
};

const waitingRoomInput = { name: 'Wait1' };
const admin = {
  firstname: 'test', lastname: 'test', email: 'admin@test.com', role: RoleEnum.ADMINISTRATEUR,
};
describe('Ticket Resolver', () => {
  describe('Create Ticket', () => {
    describe('Success cases', () => {
      it('1. should create a ticket', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);
        const user:User = await dataSource.getRepository(User).save(clientInput);

        const res1 = await client.mutate({
          mutation: CREATE_TICKET,
          variables: {
            data: {
              ...ticketInput,
              service: { id: service.id },
            },
          },
        });
        const res2 = await client.mutate({
          mutation: CREATE_TICKET,
          variables: {
            data: {
              ...ticketInput,
              service: { id: service.id },
              user: { id: user.id },
            },
          },
        });
        expect(res1.data?.createTicket).toHaveProperty('id');
        expect(res1.data?.createTicket).toHaveProperty('name', 'SV1-001');
        expect(res1.data?.createTicket).toHaveProperty('createdAt');
        expect(res1.data?.createTicket).toHaveProperty('calledAt', null);
        expect(res1.data?.createTicket).toHaveProperty('isFirstTime', false);
        expect(res1.data?.createTicket).toHaveProperty('isReturned', null);
        expect(res1.data?.createTicket).toHaveProperty('status', 1);
        expect(res1.data?.createTicket.service).toHaveProperty('id', service.id);

        expect(res2.data?.createTicket).toHaveProperty('id');
        expect(res2.data?.createTicket).toHaveProperty('name', 'SV1-002');
        expect(res2.data?.createTicket).toHaveProperty('createdAt');
        expect(res2.data?.createTicket).toHaveProperty('calledAt', null);
        expect(res2.data?.createTicket).toHaveProperty('isFirstTime', false);
        expect(res2.data?.createTicket).toHaveProperty('isReturned', null);
        expect(res2.data?.createTicket).toHaveProperty('status', 1);
        expect(res2.data?.createTicket.service).toHaveProperty('id', service.id);
        expect(res2.data?.createTicket.user).toHaveProperty('id', user.id);
      });
    });

    describe('Error cases', () => {
      it('1. should throw a service required error', async () => {
        try {
          await client.mutate({
            mutation: CREATE_TICKET,
            variables: {
              data: {
                ...ticketInput,
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors.length).toBeGreaterThan(0);
          expect(e.graphQLErrors[0].message).toMatch(/Field "service" of required type "ServiceId!" was not provided./);
        }
      });
      it('2. should throw a service not found error', async () => {
        try {
          await client.mutate({
            mutation: CREATE_TICKET,
            variables: {
              data: {
                ...ticketInput,
                service: { id: 1 },
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors.length).toBeGreaterThan(0);
          expect(e.graphQLErrors[0].message).toMatch(/Could not find any entity of type "Service"/);
        }
      });
      it('3. should throw a user not found error', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        try {
          await client.mutate({
            mutation: CREATE_TICKET,
            variables: {
              data: {
                ...ticketInput,
                service: { id: service.id },
                user: { id: 1 },
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors.length).toBeGreaterThan(0);
          expect(e.graphQLErrors[0].message).toMatch(/Could not find any entity of type "User"/);
        }
      });
    });
  });

  describe('Get All Tickets', () => {
    describe('Success cases', () => {
      it('1. should get all tickets', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        for (let i = 0; i < 2; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await dataSource.getRepository(Ticket).save({
            name: `SV1-00${i + 1}`,
            isFirstTime: false,
            service: { id: service.id },
          });
        }

        const res = await client.query({
          query: GET_ALL_TICKETS,
          fetchPolicy: 'no-cache',
        });

        expect(res.data?.getAllTickets.length).toBe(2);
        expect(res.data?.getAllTickets[0]).toHaveProperty('id');
        expect(res.data?.getAllTickets[0]).toHaveProperty('name', 'SV1-001');
        expect(res.data?.getAllTickets[0]).toHaveProperty('createdAt');
        expect(res.data?.getAllTickets[0]).toHaveProperty('calledAt', null);
        expect(res.data?.getAllTickets[0]).toHaveProperty('isFirstTime', false);
        expect(res.data?.getAllTickets[0]).toHaveProperty('isReturned', null);
        expect(res.data?.getAllTickets[0]).toHaveProperty('status', 1);
        expect(res.data?.getAllTickets[0].service).toHaveProperty('id', service.id);
        expect(res.data?.getAllTickets[1]).toHaveProperty('id');
        expect(res.data?.getAllTickets[1]).toHaveProperty('name', 'SV1-002');
        expect(res.data?.getAllTickets[1]).toHaveProperty('createdAt');
        expect(res.data?.getAllTickets[1]).toHaveProperty('calledAt', null);
        expect(res.data?.getAllTickets[1]).toHaveProperty('isFirstTime', false);
        expect(res.data?.getAllTickets[1]).toHaveProperty('isReturned', null);
        expect(res.data?.getAllTickets[1]).toHaveProperty('status', 1);
        expect(res.data?.getAllTickets[1].service).toHaveProperty('id', service.id);
      });
      it('2. should get no ticket', async () => {
        const res = await client.query({
          query: GET_ALL_TICKETS,
          fetchPolicy: 'no-cache',
        });
        expect(res.data?.getAllTickets).toBeDefined();
        expect(res.data?.getAllTickets.length).toBe(0);
      });
    });
  });

  describe('Get All Tickets for Waiting Room', () => {
    describe('Success cases', () => {
      it('1. should get all tickets for the waiting room', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save({
          ...waitingRoomInput,
          services: [{ id: service.id }],
        });

        const fakeService = await dataSource.getRepository(Service).save(fakeServiceInput);

        for (let i = 0; i < 2; i += 1) {
          await dataSource.getRepository(Ticket).save({
            name: `SV1-00${i + 1}`,
            isFirstTime: false,
            service: { id: service.id },
          });
        }

        for (let i = 0; i < 2; i += 1) {
          await dataSource.getRepository(Ticket).save({
            name: `SV2-00${i + 1}`,
            isFirstTime: false,
            service: { id: fakeService.id },
          });
        }

        const res = await client.query({
          query: GET_ALL_TICKETS_FOR_WAITING_ROOM,
          fetchPolicy: 'no-cache',
          variables: {
            waitingRoomId: waitingRoom.id,
          },
        });

        expect(res.data?.getAllTicketsForWaitingRoom.length).toBe(2);
        expect(res.data?.getAllTicketsForWaitingRoom[0]).toHaveProperty('id');
        expect(res.data?.getAllTicketsForWaitingRoom[0]).toHaveProperty('name', 'SV1-001');
        expect(res.data?.getAllTicketsForWaitingRoom[0]).toHaveProperty('createdAt');
        expect(res.data?.getAllTicketsForWaitingRoom[0]).toHaveProperty('calledAt', null);
        expect(res.data?.getAllTicketsForWaitingRoom[0]).toHaveProperty('isFirstTime', false);
        expect(res.data?.getAllTicketsForWaitingRoom[0]).toHaveProperty('isReturned', null);
        expect(res.data?.getAllTicketsForWaitingRoom[0]).toHaveProperty('status', 1);
        expect(res.data?.getAllTicketsForWaitingRoom[0].service).toHaveProperty('id', service.id);
        expect(res.data?.getAllTicketsForWaitingRoom[1]).toHaveProperty('id');
        expect(res.data?.getAllTicketsForWaitingRoom[1]).toHaveProperty('name', 'SV1-002');
        expect(res.data?.getAllTicketsForWaitingRoom[1]).toHaveProperty('createdAt');
        expect(res.data?.getAllTicketsForWaitingRoom[1]).toHaveProperty('calledAt', null);
        expect(res.data?.getAllTicketsForWaitingRoom[1]).toHaveProperty('isFirstTime', false);
        expect(res.data?.getAllTicketsForWaitingRoom[1]).toHaveProperty('isReturned', null);
        expect(res.data?.getAllTicketsForWaitingRoom[1]).toHaveProperty('status', 1);
        expect(res.data?.getAllTicketsForWaitingRoom[1].service).toHaveProperty('id', service.id);
      });
      it('2. should get no ticket', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save({
          ...waitingRoomInput,
          services: [{ id: service.id }],
        });

        const fakeService = await dataSource.getRepository(Service).save(fakeServiceInput);

        for (let i = 0; i < 2; i += 1) {
          await dataSource.getRepository(Ticket).save({
            name: `SV2-00${i + 1}`,
            isFirstTime: false,
            service: { id: fakeService.id },
          });
        }

        const res = await client.query({
          query: GET_ALL_TICKETS_FOR_WAITING_ROOM,
          fetchPolicy: 'no-cache',
          variables: {
            waitingRoomId: waitingRoom.id,
          },
        });

        expect(res.data?.getAllTicketsForWaitingRoom).toBeDefined();
        expect(res.data?.getAllTicketsForWaitingRoom.length).toBe(0);
      });
    });
    describe('Error cases', () => {
      it('1. should not work without id', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);
        await dataSource.getRepository(WaitingRoom).save({
          ...waitingRoomInput,
          services: [{ id: service.id }],
        });

        const fakeService = await dataSource.getRepository(Service).save(fakeServiceInput);

        for (let i = 0; i < 2; i += 1) {
          await dataSource.getRepository(Ticket).save({
            name: `SV1-00${i + 1}`,
            isFirstTime: false,
            service: { id: service.id },
          });
        }

        for (let i = 0; i < 2; i += 1) {
          await dataSource.getRepository(Ticket).save({
            name: `SV2-00${i + 1}`,
            isFirstTime: false,
            service: { id: fakeService.id },
          });
        }

        try {
          await client.query({
            query: GET_ALL_TICKETS_FOR_WAITING_ROOM,
            fetchPolicy: 'no-cache',
            variables: {
              waitingRoomId: null,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$waitingRoomId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should not found ticket with wrong id', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save({
          ...waitingRoomInput,
          services: [{ id: service.id }],
        });

        const fakeService = await dataSource.getRepository(Service).save(fakeServiceInput);

        for (let i = 0; i < 2; i += 1) {
          await dataSource.getRepository(Ticket).save({
            name: `SV1-00${i + 1}`,
            isFirstTime: false,
            service: { id: service.id },
          });
        }

        for (let i = 0; i < 2; i += 1) {
          await dataSource.getRepository(Ticket).save({
            name: `SV2-00${i + 1}`,
            isFirstTime: false,
            service: { id: fakeService.id },
          });
        }
        try {
          await client.query({
            query: GET_ALL_TICKETS_FOR_WAITING_ROOM,
            fetchPolicy: 'no-cache',
            variables: {
              waitingRoomId: waitingRoom.id + 1,
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

  describe('Get One Ticket By Id', () => {
    describe('Success cases', () => {
      it('1. should get a ticket', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        const ticket = await dataSource.getRepository(Ticket).save({
          ...ticketInput,
          service: { id: service.id },
        });

        const res = await client.query({
          query: GET_ONE_TICKET,
          fetchPolicy: 'no-cache',
          variables: {
            getOneTicketId: ticket.id,
          },
        });

        expect(res.data?.getOneTicket).toHaveProperty('id');
        expect(res.data?.getOneTicket).toHaveProperty('name', 'SV1-001');
        expect(res.data?.getOneTicket).toHaveProperty('createdAt');
        expect(res.data?.getOneTicket).toHaveProperty('calledAt', null);
        expect(res.data?.getOneTicket).toHaveProperty('isFirstTime', false);
        expect(res.data?.getOneTicket).toHaveProperty('isReturned', null);
        expect(res.data?.getOneTicket).toHaveProperty('status', 1);
        expect(res.data?.getOneTicket.service).toHaveProperty('id', service.id);
      });
      it('2. should get a ticket with a user', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        const user:User = await dataSource.getRepository(User).save(clientInput);

        const ticket = await dataSource.getRepository(Ticket).save({
          ...ticketInput,
          service: { id: service.id },
          user: { id: user.id },
        });

        const res = await client.query({
          query: GET_ONE_TICKET,
          fetchPolicy: 'no-cache',
          variables: {
            getOneTicketId: ticket.id,
          },
        });

        expect(res.data?.getOneTicket).toHaveProperty('id');
        expect(res.data?.getOneTicket).toHaveProperty('name', 'SV1-001');
        expect(res.data?.getOneTicket).toHaveProperty('createdAt');
        expect(res.data?.getOneTicket).toHaveProperty('calledAt', null);
        expect(res.data?.getOneTicket).toHaveProperty('isFirstTime', false);
        expect(res.data?.getOneTicket).toHaveProperty('isReturned', null);
        expect(res.data?.getOneTicket).toHaveProperty('status', 1);
        expect(res.data?.getOneTicket.service).toHaveProperty('id', service.id);
        expect(res.data?.getOneTicket.user).toHaveProperty('id', user.id);
      });
    });
    describe('Error cases', () => {
      it('1. should not work without id', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        await dataSource.getRepository(Ticket).save({
          ...ticketInput,
          service: { id: service.id },
        });
        try {
          await client.query({
            query: GET_ONE_TICKET,
            fetchPolicy: 'no-cache',
            variables: {
              getOneTicketId: null,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$getOneTicketId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should not found ticket with wrong id', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        const ticket = await dataSource.getRepository(Ticket).save({
          ...ticketInput,
          service: { id: service.id },
        });
        try {
          await client.query({
            query: GET_ONE_TICKET,
            fetchPolicy: 'no-cache',
            variables: {
              getOneTicketId: ticket.id + 1,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('Ticket not found');
        }
      });
    });
  });
  describe('Update Ticket', () => {
    describe('Success cases', () => {
      it('1. should update a ticket', async () => {
        const token = await getJWTFor(admin);
        const service = await dataSource.getRepository(Service).save(serviceInput);

        const ticketToUpdate = await dataSource.getRepository(Ticket).save({
          ...ticketInput,
          service: { id: service.id },
        });

        const res = await client.mutate({
          mutation: UPDATE_TICKET,
          variables: {
            data: { ...updateInput, service: { id: service.id } },
            updateTicketId: ticketToUpdate.id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        expect(res.data?.updateTicket).toHaveProperty('id');
        expect(res.data?.updateTicket).toHaveProperty('name', 'SV1-001');
        expect(res.data?.updateTicket).toHaveProperty('createdAt');
        expect(res.data?.updateTicket).toHaveProperty('calledAt', null);
        expect(res.data?.updateTicket).toHaveProperty('isFirstTime', true);
        expect(res.data?.updateTicket).toHaveProperty('isReturned', null);
        expect(res.data?.updateTicket).toHaveProperty('status', 1);
        expect(res.data?.updateTicket.service).toHaveProperty('id', service.id);
      });
      it('2. should add an user to a ticket', async () => {
        const token = await getJWTFor(admin);
        const service = await dataSource.getRepository(Service).save(serviceInput);

        const user:User = await dataSource.getRepository(User).save(clientInput);

        const ticketToUpdate = await dataSource.getRepository(Ticket).save({
          ...ticketInput,
          service: { id: service.id },
        });

        const res = await client.mutate({
          mutation: UPDATE_TICKET,
          variables: {
            data: { ...updateInput, service: { id: service.id }, user: { id: user.id } },
            updateTicketId: ticketToUpdate.id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        expect(res.data?.updateTicket).toHaveProperty('id');
        expect(res.data?.updateTicket).toHaveProperty('name', 'SV1-001');
        expect(res.data?.updateTicket).toHaveProperty('createdAt');
        expect(res.data?.updateTicket).toHaveProperty('calledAt', null);
        expect(res.data?.updateTicket).toHaveProperty('isFirstTime', true);
        expect(res.data?.updateTicket).toHaveProperty('isReturned', null);
        expect(res.data?.updateTicket).toHaveProperty('status', 1);
        expect(res.data?.updateTicket.service).toHaveProperty('id', service.id);
        expect(res.data?.updateTicket.user).toHaveProperty('id', user.id);
      });
    });
    describe('Error cases', () => {
      it('1. should fail without id', async () => {
        try {
          const token = await getJWTFor(admin);
          const service = await dataSource.getRepository(Service).save(serviceInput);

          await dataSource.getRepository(Ticket).save({
            ...ticketInput,
            service: { id: service.id },
          });

          await client.mutate({
            mutation: UPDATE_TICKET,
            variables: {
              data: { ...updateInput, service: { id: service.id } },
              updateTicketId: null,
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
            'Variable "$updateTicketId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should throw a not found ticket error', async () => {
        try {
          const token = await getJWTFor(admin);
          const service = await dataSource.getRepository(Service).save(serviceInput);

          const ticketToUpdate = await dataSource.getRepository(Ticket).save({
            ...ticketInput,
            service: { id: service.id },
          });
          await client.mutate({
            mutation: UPDATE_TICKET,
            variables: {
              data: { ...updateInput, service: { id: service.id } },
              updateTicketId: ticketToUpdate.id + 1,
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
          expect(e.graphQLErrors[0].message).toMatch('Ticket not found');
        }
      });
      it('3. should throw a not found service error', async () => {
        try {
          const token = await getJWTFor(admin);
          const service = await dataSource.getRepository(Service).save(serviceInput);

          const ticketToUpdate = await dataSource.getRepository(Ticket).save({
            ...ticketInput,
            service: { id: service.id },
          });

          await client.mutate({
            mutation: UPDATE_TICKET,
            variables: {
              data: {
                ...updateInput, service: { id: service.id + 1 },
              },
              updateTicketId: ticketToUpdate.id,
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
          expect(e.graphQLErrors[0].message).toMatch(/Could not find any entity of type "Service" matching/);
        }
      });
    });
  });
  describe('Delete Ticket', () => {
    describe('Success cases', () => {
      it('1. should delete a ticket', async () => {
        const token = await getJWTFor(admin);
        const service = await dataSource.getRepository(Service).save(serviceInput);

        const ticketToDelete = await dataSource.getRepository(Ticket).save({
          ...ticketInput,
          service: { id: service.id },
        });
        const res = await client.mutate({
          mutation: DELETE_TICKET,
          variables: {
            deleteTicketId: ticketToDelete.id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        expect(res.data).toHaveProperty('deleteTicket', true);
      });
      it('2. should delete a ticket with an user', async () => {
        const token = await getJWTFor(admin);
        const service = await dataSource.getRepository(Service).save(serviceInput);
        const user:User = await dataSource.getRepository(User).save(clientInput);

        const ticketToDelete = await dataSource.getRepository(Ticket).save({
          ...ticketInput,
          service: { id: service.id },
          user: { id: user.id },
        });

        const res = await client.mutate({
          mutation: DELETE_TICKET,
          variables: {
            deleteTicketId: ticketToDelete.id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        expect(res.data).toHaveProperty('deleteTicket', true);
      });
    });
    describe('Error cases', () => {
      it('1. should fail whitout id', async () => {
        try {
          const token = await getJWTFor(admin);
          const service = await dataSource.getRepository(Service).save(serviceInput);

          await dataSource.getRepository(Ticket).save({
            ...ticketInput,
            service: { id: service.id },
          });
          await client.mutate({
            mutation: DELETE_TICKET,
            variables: {
              deleteTicketId: null,
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
            'Variable "$deleteTicketId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should throw a not found error', async () => {
        try {
          const token = await getJWTFor(admin);
          const service = await dataSource.getRepository(Service).save(serviceInput);

          const ticketToDelete = await dataSource.getRepository(Ticket).save({
            ...ticketInput,
            service: { id: service.id },
          });
          await client.mutate({
            mutation: DELETE_TICKET,
            variables: {
              deleteTicketId: ticketToDelete.id + 1,
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
          expect(e.graphQLErrors[0].message).toMatch('Ticket not found');
        }
      });
    });
  });
});
