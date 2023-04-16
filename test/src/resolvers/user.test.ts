/* eslint-disable import/no-relative-packages */
import { it } from '@jest/globals';
import client from '../apolloClient';
import Service from '../../../server/src/entity/Service';
import dataSource from '../../../server/src/db';
import { CREATE_USER, DELETE_USER, UPDATE_USER } from '../graphQL/mutations/userMutations';
import { GET_ALL_USERS, GET_ONE_USER } from '../graphQL/query/userQuery';
import User from '../../../server/src/entity/User';
import WaitingRoom from '../../../server/src/entity/WaitingRoom';
import Counter from '../../../server/src/entity/Counter';
import Ticket from '../../../server/src/entity/Ticket';

const adminInput = {
  role: 1,
  lastname: 'User',
  firstname: 'Admin',
  email: 'admin@test.fr',
  password: 'P4$$W0rd',
};

const operatorInput = {
  role: 2,
  lastname: 'User',
  firstname: 'Operator',
  email: 'operator@test.fr',
  password: 'P4$$W0rd',
};

const clientInput = {
  role: 3,
  lastname: 'User',
  firstname: 'Client',
  email: 'client@test.fr',
  password: 'P4$$W0rd',
};

const clientInputWithoutRole = {
  lastname: 'User',
  firstname: 'ClientBis',
  email: 'clientbis@test.fr',
  password: 'P4$$W0rd',
};

const serviceInput = {
  name: 'Service1',
  acronym: 'SV1',
  isOpen: false,
  color: '#ffffff',
};

const ticketInput = {
  name: '',
  isFirstTime: false,
};

const waitingRoomInput = { name: 'Wait1' };

const counterName = 'Counter1';

const updateInput = {
  role: 2,
  lastname: 'UPDATED',
  firstname: 'UPDATED',
  email: 'updated@test.fr',
};

describe('User Resolver', () => {
  describe('Create User', () => {
    describe('Success cases', () => {
      it('1. should create an admin user', async () => {
        const res = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: adminInput,
          },
        });

        expect(res.data?.createUser).toHaveProperty('id');
        expect(res.data?.createUser).toHaveProperty('role', 1);
        expect(res.data?.createUser).toHaveProperty('lastname', 'User');
        expect(res.data?.createUser).toHaveProperty('firstname', 'Admin');
        expect(res.data?.createUser).toHaveProperty('email', 'admin@test.fr');
        expect(res.data?.createUser).toHaveProperty('services', []);
      });

      it('2. should create an operator user', async () => {
        const res = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: operatorInput,
          },
        });

        expect(res.data?.createUser).toHaveProperty('id');
        expect(res.data?.createUser).toHaveProperty('role', 2);
        expect(res.data?.createUser).toHaveProperty('lastname', 'User');
        expect(res.data?.createUser).toHaveProperty('firstname', 'Operator');
        expect(res.data?.createUser).toHaveProperty('email', 'operator@test.fr');
        expect(res.data?.createUser).toHaveProperty('services', []);
      });

      it('3. should create a client user', async () => {
        const userWithRoleResponse = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: clientInput,
          },
        });

        const userWithoutRoleResponse = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: clientInputWithoutRole,
          },
        });

        expect(userWithRoleResponse.data?.createUser).toHaveProperty('id');
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('role', 3);
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('lastname', 'User');
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('firstname', 'Client');
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('email', 'client@test.fr');
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('services', []);

        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('id');
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('role', 3);
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('lastname', 'User');
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('firstname', 'ClientBis');
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('email', 'clientbis@test.fr');
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('services', []);
      });

      it('4. should create an operator user with services', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        const res = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: {
              ...operatorInput, services: [{ id: service.id }],
            },
          },
        });

        expect(res.data?.createUser).toHaveProperty('id');
        expect(res.data?.createUser).toHaveProperty('role', 2);
        expect(res.data?.createUser).toHaveProperty('lastname', 'User');
        expect(res.data?.createUser).toHaveProperty('firstname', 'Operator');
        expect(res.data?.createUser).toHaveProperty('email', 'operator@test.fr');
        expect(res.data?.createUser).toHaveProperty('services', [{ __typename: 'Service', ...service }]);
      });
    });

    describe('Error cases', () => {
      it('1. should throw a password required error', async () => {
        try {
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: {
                role: 1,
                lastname: 'User',
                firstname: 'John',
                email: 'johnUser@test.fr',
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors.length).toBeGreaterThan(0);
          expect(e.graphQLErrors[0].message).toBe('PASSWORD REQUIRED');
        }
      });
      it('2. should throw an already exist error', async () => {
        try {
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: operatorInput,
            },
          });
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: operatorInput,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors.length).toBeGreaterThan(0);
          expect(e.graphQLErrors[0].message).toBe('EMAIL_ALREADY_EXISTS');
        }
      });
      it('3. should throw an error because of missing field', async () => {
        try {
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: {
                role: 2,
                lastname: null,
                firstname: 'John',
                email: 'john@test.fr',
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('Variable "$data" got invalid value null at "data.lastname"');
        }
      });
      it('4. should fail to create an operator user with unexisting service', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        try {
          const serviceIdToAffect = service.id + 1;
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: {
                ...operatorInput, services: [{ id: serviceIdToAffect }],
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

  describe('Get All Users', () => {
    describe('Success cases', () => {
      it('1. should get all users', async () => {
        await dataSource.getRepository(User).save(adminInput);

        await dataSource.getRepository(User).save(operatorInput);

        const res = await client.query({
          query: GET_ALL_USERS,
          fetchPolicy: 'no-cache',
        });

        expect(res.data?.getAllUsers.length).toBe(2);
        expect(res.data?.getAllUsers[0]).toHaveProperty('id');
        expect(res.data?.getAllUsers[0]).toHaveProperty('role', 1);
        expect(res.data?.getAllUsers[0]).toHaveProperty('lastname', 'User');
        expect(res.data?.getAllUsers[0]).toHaveProperty('firstname', 'Admin');
        expect(res.data?.getAllUsers[0]).toHaveProperty('email', 'admin@test.fr');
        expect(res.data?.getAllUsers[0]).toHaveProperty('services', []);
        expect(res.data?.getAllUsers[1]).toHaveProperty('id');
        expect(res.data?.getAllUsers[1]).toHaveProperty('role', 2);
        expect(res.data?.getAllUsers[1]).toHaveProperty('lastname', 'User');
        expect(res.data?.getAllUsers[1]).toHaveProperty('firstname', 'Operator');
        expect(res.data?.getAllUsers[1]).toHaveProperty('email', 'operator@test.fr');
        expect(res.data?.getAllUsers[1]).toHaveProperty('services', []);
      });

      it('2. should get no user', async () => {
        const res = await client.query({
          query: GET_ALL_USERS,
          fetchPolicy: 'no-cache',
        });
        expect(res.data?.getAllUsers).toBeDefined();
        expect(res.data?.getAllUsers.length).toBe(0);
      });
    });
  });

  describe('Get One Users By Id', () => {
    describe('Success cases', () => {
      it('1. should get a user', async () => {
        const firstUser:User = await dataSource.getRepository(User).save(operatorInput);

        const secondUser:User = await dataSource.getRepository(User).save(clientInput);

        const firstUserResponse = await client.query({
          query: GET_ONE_USER,
          fetchPolicy: 'no-cache',
          variables: {
            getOneUserId: firstUser.id,
          },
        });

        const secondUserResponse = await client.query({
          query: GET_ONE_USER,
          fetchPolicy: 'no-cache',
          variables: {
            getOneUserId: secondUser.id,
          },
        });

        expect(firstUserResponse.data?.getOneUser).toHaveProperty('id');
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('role', 2);
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('lastname', 'User');
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('firstname', 'Operator');
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('email', 'operator@test.fr');
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('services', []);

        expect(secondUserResponse.data?.getOneUser).toHaveProperty('id');
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('role', 3);
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('lastname', 'User');
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('firstname', 'Client');
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('email', 'client@test.fr');
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('services', []);
      });
      it('2. should return an client with ticket values', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        const clientUser:User = await dataSource.getRepository(User).save(clientInput);

        const dataTicket = {
          ...ticketInput,
          user: { id: clientUser.id },
          service: { id: service.id },
        };

        await dataSource.getRepository(Ticket).save(dataTicket);

        const clientResponse = await client.query({
          query: GET_ONE_USER,
          fetchPolicy: 'no-cache',
          variables: {
            getOneUserId: clientUser.id,
          },
        });

        expect(clientResponse.data?.getOneUser).toHaveProperty('id');
        expect(clientResponse.data?.getOneUser).toHaveProperty('role', 3);
        expect(clientResponse.data?.getOneUser).toHaveProperty('lastname', 'User');
        expect(clientResponse.data?.getOneUser).toHaveProperty('firstname', 'Client');
        expect(clientResponse.data?.getOneUser).toHaveProperty('email', 'client@test.fr');
        expect(clientResponse.data?.getOneUser.tickets.length).toBeGreaterThan(0);
      });
      it('3. should return an operator with service and counter values', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

        const dataCounter = {
          name: counterName,
          waitingRoom: { id: waitingRoom.id },
        };
        const counter = await dataSource.getRepository(Counter).save(dataCounter);

        const service = await dataSource.getRepository(Service).save(serviceInput);

        const operatorUser:User = await dataSource.getRepository(User).save({
          ...operatorInput,
          counter: { id: counter.id },
          services: [{ id: service.id }],
        });

        const operatorResponse = await client.query({
          query: GET_ONE_USER,
          fetchPolicy: 'no-cache',
          variables: {
            getOneUserId: operatorUser.id,
          },
        });

        expect(operatorResponse.data?.getOneUser).toHaveProperty('id');
        expect(operatorResponse.data?.getOneUser).toHaveProperty('role', 2);
        expect(operatorResponse.data?.getOneUser).toHaveProperty('lastname', 'User');
        expect(operatorResponse.data?.getOneUser).toHaveProperty('firstname', 'Operator');
        expect(operatorResponse.data?.getOneUser).toHaveProperty('email', 'operator@test.fr');
        expect(operatorResponse.data?.getOneUser.services[0]).toHaveProperty('name', 'Service1');
        expect(operatorResponse.data?.getOneUser.services[0]).toHaveProperty('acronym', 'SV1');
        expect(operatorResponse.data?.getOneUser.services[0]).toHaveProperty('isOpen', false);
        expect(operatorResponse.data?.getOneUser.services[0]).toHaveProperty('color', '#ffffff');
        expect(operatorResponse.data?.getOneUser.counter).toHaveProperty('name', 'Counter1');
      });
    });
    describe('Error cases', () => {
      it('1. should not work without id', async () => {
        await dataSource.getRepository(User).save(clientInput);

        try {
          await client.query({
            query: GET_ONE_USER,
            fetchPolicy: 'no-cache',
            variables: {
              getOneUserId: null,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$getOneUserId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should not found user with wrong id', async () => {
        const user:User = await dataSource.getRepository(User).save(clientInput);

        try {
          await client.query({
            query: GET_ONE_USER,
            fetchPolicy: 'no-cache',
            variables: {
              getOneUserId: user.id + 1,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('User not found');
        }
      });
    });
  });
  describe('Update User', () => {
    describe('Success cases', () => {
      it('1. should update an user', async () => {
        const userToUpdate: User = await dataSource.getRepository(User).save(clientInput);

        const res = await client.mutate({
          mutation: UPDATE_USER,
          variables: {
            data: updateInput,
            updateUserId: userToUpdate.id,
          },
        });

        expect(res.data?.updateUser).toHaveProperty('id');
        expect(res.data?.updateUser).toHaveProperty('role', 2);
        expect(res.data?.updateUser).toHaveProperty('lastname', 'UPDATED');
        expect(res.data?.updateUser).toHaveProperty('firstname', 'UPDATED');
        expect(res.data?.updateUser).toHaveProperty('email', 'updated@test.fr');
      });
      it('2. should add a service and a counter to an operator', async () => {
        const userToUpdate: User = await dataSource.getRepository(User).save(operatorInput);

        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

        const dataCounter = {
          name: counterName,
          waitingRoom: { id: waitingRoom.id },
        };
        const counter = await dataSource.getRepository(Counter).save(dataCounter);

        const service = await dataSource.getRepository(Service).save(serviceInput);

        const res = await client.mutate({
          mutation: UPDATE_USER,
          variables: {
            data: {
              ...updateInput,
              services: [{ id: service.id }],
              counter: { id: counter.id },
            },
            updateUserId: userToUpdate.id,
          },
        });

        expect(res.data?.updateUser).toHaveProperty('id');
        expect(res.data?.updateUser).toHaveProperty('role', 2);
        expect(res.data?.updateUser).toHaveProperty('lastname', 'UPDATED');
        expect(res.data?.updateUser).toHaveProperty('firstname', 'UPDATED');
        expect(res.data?.updateUser).toHaveProperty('email', 'updated@test.fr');
        expect(res.data?.updateUser.services[0]).toHaveProperty('name', 'Service1');
        expect(res.data?.updateUser.services[0]).toHaveProperty('acronym', 'SV1');
        expect(res.data?.updateUser.services[0]).toHaveProperty('isOpen', false);
        expect(res.data?.updateUser.services[0]).toHaveProperty('color', '#ffffff');
        expect(res.data?.updateUser.counter).toHaveProperty('name', 'Counter1');
      });
      it('3. should remove service and counter from operator', async () => {
        const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

        const dataCounter = {
          name: counterName,
          waitingRoom: { id: waitingRoom.id },
        };
        const counter = await dataSource.getRepository(Counter).save(dataCounter);

        const service = await dataSource.getRepository(Service).save(serviceInput);

        const userToUpdate:User = await dataSource.getRepository(User).save({
          ...operatorInput,
          counter: { id: counter.id },
          services: [{ id: service.id }],
        });

        const res = await client.mutate({
          mutation: UPDATE_USER,
          variables: {
            data: {
              ...updateInput,
              services: [],
              counter: null,
            },
            updateUserId: userToUpdate.id,
          },
        });
        expect(res.data?.updateUser).toHaveProperty('id');
        expect(res.data?.updateUser).toHaveProperty('role', 2);
        expect(res.data?.updateUser).toHaveProperty('lastname', 'UPDATED');
        expect(res.data?.updateUser).toHaveProperty('firstname', 'UPDATED');
        expect(res.data?.updateUser).toHaveProperty('email', 'updated@test.fr');
        expect(res.data?.updateUser).toHaveProperty('services', []);
        expect(res.data?.updateUser).toHaveProperty('counter', null);
      });
    });
    describe('Error cases', () => {
      it('1. should fail without id', async () => {
        try {
          await dataSource.getRepository(User).save(clientInput);

          await client.mutate({
            mutation: UPDATE_USER,
            variables: {
              data: updateInput,
              updateUserId: null,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$updateUserId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should throw a not found user error', async () => {
        try {
          const userToUpdate: User = await dataSource.getRepository(User).save(clientInput);

          await client.mutate({
            mutation: UPDATE_USER,
            variables: {
              data: updateInput,
              updateUserId: userToUpdate.id + 1,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('User not found');
        }
      });
      it('3. should throw a not found service error', async () => {
        try {
          const userToUpdate: User = await dataSource.getRepository(User).save(operatorInput);

          const service = await dataSource.getRepository(Service).save(serviceInput);

          await client.mutate({
            mutation: UPDATE_USER,
            variables: {
              data: {
                ...updateInput, services: [{ id: service.id + 1 }],
              },
              updateUserId: userToUpdate.id,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(/Could not find any entity of type "Service" matching/);
        }
      });
      it('4. should throw a not found counter error', async () => {
        try {
          const userToUpdate: User = await dataSource.getRepository(User).save(clientInput);

          await dataSource.getRepository(Service).save(serviceInput);

          const waitingRoom = await dataSource.getRepository(WaitingRoom).save(waitingRoomInput);

          const dataCounter = {
            name: counterName,
            waitingRoom: { id: waitingRoom.id },
          };
          const counter = await dataSource.getRepository(Counter).save(dataCounter);

          await client.mutate({
            mutation: UPDATE_USER,
            variables: {
              data: {
                ...updateInput, counter: { id: counter.id + 1 },
              },
              updateUserId: userToUpdate.id,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(/Could not find any entity of type "Counter" matching/);
        }
      });
    });
  });
  describe('Delete User', () => {
    describe('Success cases', () => {
      it('1. should delete an user', async () => {
        const userToDelete: User = await dataSource.getRepository(User).save(clientInput);

        const res = await client.mutate({
          mutation: DELETE_USER,
          variables: {
            deleteUserId: userToDelete.id,
          },
        });
        expect(res.data).toHaveProperty('deleteUser', true);
      });
      it('2. should delete an user with service', async () => {
        const service = await dataSource.getRepository(Service).save(serviceInput);

        const userToDelete:User = await dataSource.getRepository(User).save({
          ...operatorInput,
          services: [{ id: service.id }],
        });

        const res = await client.mutate({
          mutation: DELETE_USER,
          variables: {
            deleteUserId: userToDelete.id,
          },
        });
        expect(res.data).toHaveProperty('deleteUser', true);
      });
    });
    describe('Error cases', () => {
      it('1. should fail whitout id', async () => {
        try {
          await dataSource.getRepository(User).save(clientInput);

          await client.mutate({
            mutation: DELETE_USER,
            variables: {
              deleteUserId: null,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch(
            'Variable "$deleteUserId" of non-null type "Int!" must not be null.',
          );
        }
      });
      it('2. should throw a not found error', async () => {
        try {
          const userToDelete: User = await dataSource.getRepository(User).save(clientInput);

          await client.mutate({
            mutation: DELETE_USER,
            variables: {
              deleteUserId: userToDelete.id + 1,
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.graphQLErrors[0].message).toMatch('User not found');
        }
      });
    });
  });
});
