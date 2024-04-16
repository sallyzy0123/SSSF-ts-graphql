/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {Category} from '../src/types/DBTypes';
import {App} from 'supertest/types';

const postCategory = async (
  url: App,
  newCategory: Partial<Category>
): Promise<{message: string; category?: Category}> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Mutation($categoryName: String!) {
          addCategory(category_name: $categoryName) {
            category_name
            id
          }
        }`,
        variables: {
          category: {
            categoryName: newCategory.category_name,
          }
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const categoryResponse = response.body.data.addCategory as {
            message: string;
            category?: Category;
          };
          expect(categoryResponse.category?.category_name).toBe(newCategory.category_name);
          resolve(categoryResponse);
        }
      });
  });
};

// const getCategoryById = async (
//   url: string | Function,
//   id: string
// ): Promise<Category> => {
//   return new Promise((resolve, reject) => {
//     request(url)
//       .post('/graphql')
//       .set('Content-type', 'application/json')
//       .send({
//         query: `query CategoryById($categoryByIdId: ID!) {
//           categoryById(id: $categoryByIdId) {
//             category_name
//             id
//           }
//         }`,
//         variables: {
//           categoryByIdId: id,
//         },
//       })
//       .expect(200, (err, response) => {
//         if (err) {
//           reject(err);
//         } else {
//           const category = response.body.data.categoryById as Category;
//           expect(category.id).toBe(id);
//           resolve(category);
//         }
//       });
//   });
// };

export {postCategory};
