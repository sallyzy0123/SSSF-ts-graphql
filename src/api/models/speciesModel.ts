import mongoose from 'mongoose';
import {Species} from '../../types/DBTypes';

const speciesSchema = new mongoose.Schema<Species>({
  species_name: {
    type: String,
    unique: true,
    minlength: [2, 'Minimum length is 2 characters.'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required.'],
  },
  image: {
    type: String,
    required: [true, 'Image is required.'],
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

speciesSchema.index({location: '2dsphere'});

export default mongoose.model<Species>('Species', speciesSchema);
