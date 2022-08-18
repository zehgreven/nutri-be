import mongoose from 'mongoose';
import { BaseModel } from '.';

export interface FunctionalityType extends BaseModel {
  name: string;
  description: string;
}

export interface ExistingFunctionalityType extends FunctionalityType {
  id: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const FunctionalityType = mongoose.model<FunctionalityType>(
  'FunctionalityType',
  schema,
);
