/* eslint-disable import/no-relative-packages */
import { it } from '@jest/globals';
import { gql } from '@apollo/client';
import client from './apolloClient';
import Service from '../../server/src/entity/Service';
import dataSource from '../../server/src/db';

const createUserMutation = gql`
    mutation CreateUser($data: UserInput!) {
        createUser(data: $data) {
            id
            role
            lastname
            firstname
            email
            services {
                id
                color
                acronym
                name
                open
            }
        }
    }
`;

describe('User Resolver', async () => {
  const dataService = {
    name: 'Service1',
    acronym: 'SV1',
    open: false,
    color: '#ffffff',
  };
  const service = await dataSource.getRepository(Service).save(dataService);

  describe('Create User', () => {
    describe('Success cases', () => {
      it('1. should create an admin user', async () => {
        const res = await client.mutate({
          mutation: createUserMutation,
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
          mutation: createUserMutation,
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
          mutation: createUserMutation,
          variables: {
            data: {
              role: 3, lastname: 'Doe', firstname: 'John', email: 'johndoe@fake.fr', password: 'P4$$W0rd',
            },
          },
        });

        const userWithoutRoleResponse = await client.mutate({
          mutation: createUserMutation,
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
        const res = await client.mutate({
          mutation: createUserMutation,
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
            mutation: createUserMutation,
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
            mutation: createUserMutation,
            variables: {
              data: userToCreate,
            },
          });
          await client.mutate({
            mutation: createUserMutation,
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
            mutation: createUserMutation,
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
        try {
          const serviceIdToAffect = service.id + 1;
          await client.mutate({
            mutation: createUserMutation,
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
});
