import {GraphQLError} from 'graphql';
import {Category, Species} from '../../types/DBTypes';
import categoryModel from '../models/categoryModel';
import {MyContext} from '../../types/MyContext';
import speciesModel from '../models/speciesModel';
import animalModel from '../models/animalModel';

export default {
  Species: {
    category: async (parent: Species): Promise<Category> => {
      const category = await categoryModel.findById(parent.category);
      if (!category) {
        throw new GraphQLError('Category not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return category;
    },
  },
  Query: {
    categories: async (): Promise<Category[]> => {
      return await categoryModel.find();
    },
    category: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<Category> => {
      const category = await categoryModel.findById(args.id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    },
  },
  Mutation: {
    addCategory: async (
      _parent: undefined,
      args: {category: Omit<Category, '_id'>},
      context: MyContext,
    ): Promise<{message: string; category?: Category}> => {
      if (!context.userdata || context.userdata.role !== 'admin') {
        throw new GraphQLError('User not authorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      const category = await categoryModel.create(args.category);
      if (category) {
        return {message: 'Category added', category};
      } else {
        return {message: 'Category not added'};
      }
    },
    modifyCategory: async (
      _parent: undefined,
      args: {category: Omit<Category, '_id'>; id: string},
    ): Promise<{message: string; category?: Category}> => {
      const category = await categoryModel.findByIdAndUpdate(
        args.id,
        args.category,
        {new: true},
      );
      if (category) {
        return {message: 'Category updated', category};
      } else {
        return {message: 'Category not updated'};
      }
    },
    deleteCategory: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; category?: Category}> => {
      if (!context.userdata || context.userdata.role !== 'admin') {
        throw new GraphQLError('User not authorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      // delete species and animals that belong to this category
      const allSpecies = await speciesModel.find({category: args.id});
      for (const species of allSpecies) {
        await animalModel.deleteMany({species: species._id});
      }

      await speciesModel.deleteMany({category: args.id});

      const category = await categoryModel.findByIdAndDelete(args.id);
      if (category) {
        return {message: 'Category deleted', category};
      } else {
        return {message: 'Category not deleted'};
      }
    },
  },
};
