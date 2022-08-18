import mongoose from 'mongoose';
import { BaseModel } from '.';

export interface Profile extends BaseModel {
  name: string;
  description: string;
}

export interface ExistingProfile extends Profile {
  id: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    path: { type: String },
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

export const Profile = mongoose.model<Profile>('Profile', schema);
