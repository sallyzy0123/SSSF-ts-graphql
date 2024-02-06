// TODO: Schema for animal model
import mongoose from 'mongoose';
import {Animal} from '../../types/DBTypes';

const animalSchema = new mongoose.Schema<Animal>({
  animal_name: {
    type: String,
    required: true,
    unique: true,
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
    max: Date.now(),
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
});

const AnimalModel = mongoose.model<Animal>('Animal', animalSchema);

export default AnimalModel;
