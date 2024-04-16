import dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';
import mongoose from 'mongoose';
import randomstring from 'randomstring';
import {postCategory} from './categoryFunctions';
import {Category} from '../src/types/DBTypes';

describe('test for /graphql', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let newCategory: Category;
  const testCategory: Partial<Category> = {
    category_name: 'test category' + randomstring.generate(7),
  };

  it('should create a new category', async () => {
    const response = await postCategory(app, testCategory);
    if (response.category) {
      newCategory = response.category;
    }
  });

  // it('should get a category by id', async () => {
  //   await getCategoryById(app, newCategory._id!);
  // });
});
