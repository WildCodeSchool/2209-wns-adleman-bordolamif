/* eslint-disable import/no-relative-packages */
import { it } from '@jest/globals';
import client from '../apolloClient';
import Service from '../../../server/src/entity/Service';
import dataSource from '../../../server/src/db';
import { CREATE_USER } from '../graphQL/mutations/userMutations';
import User from '../../../server/src/entity/User';
import { GET_ALL_USERS, GET_ONE_USER } from '../graphQL/query/userQuery';

describe('User Resolver', () => {
  describe('Create User', () => {
    describe('Success cases', () => {
      it('1. should create an admin user', async () => {
        const res = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: {
              role: 1, lastname: 'Doe', firstname: 'John', email: 'johndoe@fake.fr', password: 'P4$$W0rd',
            },
          },
        });

        expect(res.data?.createUser).toHaveProperty('id');
        expect(res.data?.createUser).toHaveProperty('role', 1);
        expect(res.data?.createUser).toHaveProperty('lastname', 'Doe');
        expect(res.data?.createUser).toHaveProperty('firstname', 'John');
        expect(res.data?.createUser).toHaveProperty('email', 'johndoe@fake.fr');
        expect(res.data?.createUser).toHaveProperty('services', []);
      });

      it('2. should create an operator user', async () => {
        const res = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: {
              role: 2, lastname: 'Doe', firstname: 'John', email: 'johndoe@fake.fr',
            },
          },
        });

        expect(res.data?.createUser).toHaveProperty('id');
        expect(res.data?.createUser).toHaveProperty('role', 2);
        expect(res.data?.createUser).toHaveProperty('lastname', 'Doe');
        expect(res.data?.createUser).toHaveProperty('firstname', 'John');
        expect(res.data?.createUser).toHaveProperty('email', 'johndoe@fake.fr');
        expect(res.data?.createUser).toHaveProperty('services', []);
      });

      it('3. should create a client user', async () => {
        const userWithRoleResponse = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: {
              role: 3, lastname: 'Doe', firstname: 'John', email: 'johndoe@fake.fr', password: 'P4$$W0rd',
            },
          },
        });

        const userWithoutRoleResponse = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: {
              lastname: 'Doe', firstname: 'Jane', email: 'janedoe@fake.fr', password: 'P4$$W0rd',
            },
          },
        });

        expect(userWithRoleResponse.data?.createUser).toHaveProperty('id');
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('role', 3);
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('lastname', 'Doe');
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('firstname', 'John');
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('email', 'johndoe@fake.fr');
        expect(userWithRoleResponse.data?.createUser).toHaveProperty('services', []);

        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('id');
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('role', 3);
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('lastname', 'Doe');
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('firstname', 'Jane');
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('email', 'janedoe@fake.fr');
        expect(userWithoutRoleResponse.data?.createUser).toHaveProperty('services', []);
      });

      it('4. should create an operator user with services', async () => {
        const dataService = {
          name: 'Service1',
          acronym: 'SV1',
          open: false,
          color: '#ffffff',
        };
        const service = await dataSource.getRepository(Service).save(dataService);

        const res = await client.mutate({
          mutation: CREATE_USER,
          variables: {
            data: {
              role: 2, lastname: 'Doe', firstname: 'John', email: 'johndoe@fake.fr', services: [{ id: service.id }],
            },
          },
        });

        expect(res.data?.createUser).toHaveProperty('id');
        expect(res.data?.createUser).toHaveProperty('role', 2);
        expect(res.data?.createUser).toHaveProperty('lastname', 'Doe');
        expect(res.data?.createUser).toHaveProperty('firstname', 'John');
        expect(res.data?.createUser).toHaveProperty('email', 'johndoe@fake.fr');
        expect(res.data?.createUser).toHaveProperty('services', [{ __typename: 'Service', ...service }]);
      });
    });

    describe('Error cases', () => {
      it('1.should throw a password required error', async () => {
        try {
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: {
                role: 1,
                lastname: 'Doe',
                firstname: 'John',
                email: 'johndoe@fake.fr',
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
      it('2.should throw an already exist error', async () => {
        const userToCreate = {
          role: 2,
          lastname: 'Doe',
          firstname: 'John',
          email: 'johndoe@fake.fr',
        };
        try {
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: userToCreate,
            },
          });
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: userToCreate,
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
      it('3.should throw an error because of missing field', async () => {
        try {
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: {
                role: 2,
                lastname: null,
                firstname: 'John',
                email: 'johndoe@fake.fr',
              },
            },
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.graphQLErrors).toBeDefined();
          expect(e.networkError.statusCode).toBe(400);
        }
      });
      it('4. should fail to create an operator user with unexisting service', async () => {
        const dataService = {
          name: 'Service1',
          acronym: 'SV1',
          open: false,
          color: '#ffffff',
        };
        const service = await dataSource.getRepository(Service).save(dataService);

        try {
          const serviceIdToAffect = service.id + 1;
          await client.mutate({
            mutation: CREATE_USER,
            variables: {
              data: {
                role: 2, lastname: 'Doe', firstname: 'John', email: 'johndoe@fake.fr', services: [{ id: serviceIdToAffect }],
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
        await dataSource.getRepository(User).save({
          role: 3,
          lastname: 'Doe',
          firstname: 'John',
          email: 'johndoe@fake.fr',
          password: 'P4$$W0rd',
        });

        await dataSource.getRepository(User).save({
          lastname: 'Doe', firstname: 'Jane', email: 'janedoe@fake.fr', password: 'P4$$W0rd',
        });

        const res = await client.query({
          query: GET_ALL_USERS,
        });

        expect(res.data?.getAllUsers.length).toBe(2);
        expect(res.data?.getAllUsers[0]).toHaveProperty('id');
        expect(res.data?.getAllUsers[0]).toHaveProperty('role', 3);
        expect(res.data?.getAllUsers[0]).toHaveProperty('lastname', 'Doe');
        expect(res.data?.getAllUsers[0]).toHaveProperty('firstname', 'John');
        expect(res.data?.getAllUsers[0]).toHaveProperty('email', 'johndoe@fake.fr');
        expect(res.data?.getAllUsers[0]).toHaveProperty('services', []);
        expect(res.data?.getAllUsers[1]).toHaveProperty('id');
        expect(res.data?.getAllUsers[1]).toHaveProperty('role', 3);
        expect(res.data?.getAllUsers[1]).toHaveProperty('lastname', 'Doe');
        expect(res.data?.getAllUsers[1]).toHaveProperty('firstname', 'Jane');
        expect(res.data?.getAllUsers[1]).toHaveProperty('email', 'janedoe@fake.fr');
        expect(res.data?.getAllUsers[1]).toHaveProperty('services', []);
      });

      it('2. should get no user', async () => {
        const res = await client.query({
          query: GET_ALL_USERS,
        });
        expect(res.data?.getAllUsers).toBeDefined();
        expect(res.data?.getAllUsers.length).toBe(0);
      });
    });
  });

  describe('Get One Users By Id', () => {
    describe('Success cases', () => {
      it('1. should get a users', async () => {
        const firstUser:User = await dataSource.getRepository(User).save({
          role: 3,
          lastname: 'First',
          firstname: 'User',
          email: 'firstuser@test.fr',
          password: 'P4$$W0rd',
        });

        const secondUser:User = await dataSource.getRepository(User).save({
          lastname: 'Second', firstname: 'User', email: 'seconduser@fake.fr', password: 'P4$$W0rd',
        });

        const firstUserResponse = await client.query({
          query: GET_ONE_USER,
          variables: {
            data: { id: firstUser.id },
          },
        });

        const secondUserResponse = await client.query({
          query: GET_ONE_USER,
          variables: {
            data: { id: secondUser.id },
          },
        });

        expect(firstUserResponse.data?.getOneUser).toHaveProperty('id');
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('role', 3);
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('lastname', 'First');
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('firstname', 'User');
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('email', 'firstuser');
        expect(firstUserResponse.data?.getOneUser).toHaveProperty('services', []);

        expect(secondUserResponse.data?.getOneUser).toHaveProperty('id');
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('role', 3);
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('lastname', 'Second');
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('firstname', 'User');
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('email', 'seconduser@fake.fr');
        expect(secondUserResponse.data?.getOneUser).toHaveProperty('services', []);
      });
    });
  });
});
