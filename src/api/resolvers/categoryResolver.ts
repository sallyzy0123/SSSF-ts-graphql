// TODO: categoryResolver
import {Category, Species} from '../../types/DBTypes';
import categoryModel from '../models/categoryModel';

export default {
  Species: {
    category: async (parent: Species): Promise<Category> => {
      const category = await categoryModel.findById(parent.category);
      if (!category) {
        throw new Error('Category not found!');
      }
      return category;
    }
  },
  Query: {
    categories: async (): Promise<Category[]> => {
      return await categoryModel.find();
    },
    category: async (
      _parent: undefined,
      args: {id: string}
    ): Promise<Category> => {
      const category = await categoryModel.findById(args.id);
      if (!category) {
        throw new Error('Category not found!');
      }
      return category;
    },
  },
  Mutation: {
    addCategory: async (
      _parent: undefined,
      args: {category: Omit<Category, '_id'>}
    ) => {
      const category = await categoryModel.create(args.category);
      if (category) {
        return {message: 'Category added', category: category};
      } else {
        return {message: 'Category not added!'}
      }
    },
    modifyCategory: async (
      _parent: undefined,
      args: {category: Omit<Category, '_id'>; id: string}
    ): Promise<{message: string; category?: Category}> => {
      const category = await categoryModel.findByIdAndUpdate(
        args.id,
        args.category,
        {new: true}
      );
      if (category) {
        return {message: 'Category updated', category: category};
      } else {
        return {message: 'Category not updated!'}
      }
    },
    deleteCategory: async (
      _parent: undefined,
      args: {id: string}
    ): Promise<{message: string; category?: Category}> => {
      const category = await categoryModel.findByIdAndDelete(args.id);
      if (category) {
        return {message: 'Category deleted', category};
      } else {
        return {message: 'Category not deleted!'};
      }
    },
  },
}
