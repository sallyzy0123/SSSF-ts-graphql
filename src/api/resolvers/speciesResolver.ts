import {Animal, Species} from '../../types/DBTypes';
import speciesModel from '../models/speciesModel';

export default {
  Animal: {
    species: async (parent: Animal): Promise<Species> => {
      const species = await speciesModel.findById(parent.species);
      if (!species) {
        throw new Error('Species not found');
      }
      return species;
    },
  },
  Query: {
    species: async (): Promise<Species[]> => {
      return await speciesModel.find();
    },
    speciesByID: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<Species> => {
      const species = await speciesModel.findById(args.id);
      if (!species) {
        throw new Error('Species not found');
      }
      return species;
    },
  },
  Mutation: {
    addSpecies: async (
      _parent: undefined,
      args: {species: Omit<Species, '_id'>},
    ): Promise<{message: string; species?: Species}> => {
      const species = await speciesModel.create(args.species);
      if (species) {
        return {message: 'Species added', species};
      } else {
        return {message: 'Species not added'};
      }
    },
    modifySpecies: async (
      _parent: undefined,
      args: {species: Omit<Species, '_id'>; id: string},
    ): Promise<{message: string; species?: Species}> => {
      const species = await speciesModel.findByIdAndUpdate(
        args.id,
        args.species,
        {new: true},
      );
      if (species) {
        return {message: 'Species updated', species};
      } else {
        return {message: 'Species not updated'};
      }
    },
    deleteSpecies: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<{message: string; species?: Species}> => {
      const species = await speciesModel.findByIdAndDelete(args.id);
      if (species) {
        return {message: 'Species deleted', species};
      } else {
        return {message: 'Species not deleted'};
      }
    },
  },
};
