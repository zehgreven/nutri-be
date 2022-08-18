import mongoose from 'mongoose';
import { BaseModel } from '.';

export interface Functionality extends BaseModel {
  name: string;
  description: string;
  path: string;
  functionalityTypeId: string;
}

export interface ExistingFunctionality extends Functionality {
  id: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    path: { type: String },
    active: { type: Boolean, default: false },
    functionalityTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FunctionalityType',
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        ret.functionalityTypeId = ret.functionalityTypeId.toString();
      },
    },
  },
);

export const Functionality = mongoose.model<Functionality>(
  'Functionality',
  schema,
);
