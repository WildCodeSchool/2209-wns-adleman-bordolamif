import { it } from '@jest/globals';
import { gql } from '@apollo/client';
import client from './apolloClient';

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

describe('User Resolver', () => {
  describe('Create User', () => {
    it('should create an operator with the corresponding values', async () => {
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

    it('should create an admin with the corresponding values', async () => {
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

    it('should throw an error', async () => {
      const res = await client.mutate({
        mutation: createUserMutation,
        variables: {
          data: {
            role: 1, lastname: 'Doe', firstname: 'John', email: 'johndoe@fake.fr',
          },
        },
      });
      expect(res.errors).rejects.toThrow();
    });
  });
});
