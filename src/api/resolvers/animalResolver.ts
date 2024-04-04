// TODO: animalResolver
import {Animal} from '../../types/DBTypes';
const animalData = [
   {
      id: '1',
      animal_name: 'Frank',
      species: '1',
   },
];

const speciesData = [
   {
      id: '1',
      species_name: 'Cat',
      category: '1',
   },
];



export default {
   Query: {
      animals: (_parent: undefined, args: Animal) => {
       return animalData;
      },
   },
};
