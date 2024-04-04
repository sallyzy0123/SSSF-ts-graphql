// TODO: Schema for animal model
import mongoose from 'mongoose';
import {Animal} from '../../types/DBTypes';

const animalSchema = new mongoose.Schema<Animal>({
  animal_name: {
    type: String,
    minlength: [2, 'Minimum length is 2 characters.'],
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: [true, 'Species is required.'],
  },
  birthdate: {
    type: Date,
    required: [true, 'Birthdate is required.'],
    max: [Date.now(), 'Birthdate cannot be in the future.'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required.'],
  },
});

export default mongoose.model<Animal>('Animal', animalSchema);
