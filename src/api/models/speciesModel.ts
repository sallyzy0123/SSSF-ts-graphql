// TODO: Schema for species model
import mongoose from 'mongoose';
import {Species} from '../../types/DBTypes';

const speciesSchema = new mongoose.Schema<Species>({
  species_name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const SpeciesModel = mongoose.model<Species>('Species', speciesSchema);

export default SpeciesModel;
