import {GraphQLError} from 'graphql';
import {Animal} from '../../types/DBTypes';
import animalModel from '../models/animalModel';
import {MyContext} from '../../types/MyContext';
import {io, Socket} from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../../types/Socket';

if (!process.env.SOCKET_URL) {
  throw new Error('SOCKET_URL not defined');
}

// socket io client
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.SOCKET_URL,);

export default {
  Query: {
    animals: async (): Promise<Animal[]> => {
      return await animalModel.find();
    },
    animal: async (_parent: undefined, args: {id: string}): Promise<Animal> => {
      const animal = await animalModel.findById(args.id);
      if (!animal) {
        throw new GraphQLError('Animal not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return animal;
    },
  },
  Mutation: {
    addAnimal: async (
      _parent: undefined,
      args: {animal: Omit<Animal, '_id'>},
      context: MyContext,
    ): Promise<{message: string; animal?: Animal}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      args.animal.owner = context.userdata._id;
      const animal = await animalModel.create(args.animal);
      if (animal) {
        socket.emit('update', 'animal');
        return {message: 'Animal added', animal};
      } else {
        return {message: 'Animal not added'};
      }
    },
    modifyAnimal: async (
      _parent: undefined,
      args: {animal: Omit<Animal, '_id'>; id: string},
      context: MyContext,
    ): Promise<{message: string; animal?: Animal}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      let filter = {_id: args.id, owner: context.userdata._id};
      if (context.userdata.role === 'admin') {
        delete filter.owner;
      }
      const animal = await animalModel.findByIdAndUpdate(args.id, args.animal, {
        new: true,
      });
      if (animal) {
        return {message: 'Animal updated', animal};
      } else {
        return {message: 'Animal not updated'};
      }
    },
    deleteAnimal: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; animal?: Animal}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      let filter = {_id: args.id, owner: context.userdata._id};
      if (context.userdata.role === 'admin') {
        delete filter.owner;
      }
      const animal = await animalModel.findByIdAndDelete(filter);
      if (animal) {
        return {message: 'Animal deleted', animal};
      } else {
        return {message: 'Animal not deleted'};
      }
    },
  },
};
