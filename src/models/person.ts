import mongoose from 'mongoose';
import { BaseModel } from '.';

export interface Person extends BaseModel {
  name: string;
  email: string;
  birthDate: Date;
  gender: string;
}

export interface ExistingPerson extends Person {
  id: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    birthDate: { type: Date },
    gender: { type: String },
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

export const Person = mongoose.model<Person>('Person', schema);
