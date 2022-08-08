import mongoose from 'mongoose';
import { BaseModel } from '.';

export interface Profile extends BaseModel {
  name: string;
  description: string;
  permissions: string[];
}

export interface ExistingProfile extends Profile {
  id: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    path: { type: String },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
      },
    ],
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        ret.permissions = ret.permissions.map((p: string) => p.toString());
      },
    },
  },
);

export const Profile = mongoose.model<Profile>('Profile', schema);
