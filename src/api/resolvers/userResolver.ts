import {GraphQLError} from 'graphql';
import {User, UserWithoutPasswordRole} from '../../types/DBTypes';
import fetchData from '../../lib/fetchData';
import {MessageResponse} from '../../types/MessageTypes';

export default {
  Query: {
    users: async (): Promise<UserWithoutPasswordRole[]> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const users = await fetchData<User[]>(process.env.AUTH_URL + '/users');
      users.forEach((user) => {
        user.id = user._id;
      });
      return users;
    },
    user: async (
      _parent: undefined, args: {id: string}
    ): Promise<UserWithoutPasswordRole> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + args.id,
      );
      user.id = user._id;
      return user;
    },
  },
  Mutation: {
    register: async (
      _parent: undefined,
      args: {user: Omit<User, 'role'>},
    ): Promise<{user: UserWithoutPasswordRole; message: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      };

      const registerResponse = await fetchData<MessageResponse & {data: User}>(
        process.env.AUTH_URL + '/users',
        options,
      );
      registerResponse.data.id = registerResponse.data._id;

      return {user: registerResponse.data, message: registerResponse.message};
    },
    login: async (
      _parent: undefined,
      args: {email: string; password: string},
    ): Promise<{user: UserWithoutPasswordRole; message: string; token: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: args.email, password: args.password}),
      };

      const loginResponse = await fetchData<MessageResponse & {token: string; user: UserWithoutPasswordRole}>(
        process.env.AUTH_URL + '/auth/login',
        options,
      );
      loginResponse.user.id = loginResponse.user._id;

      return loginResponse;
    },
  },
};
