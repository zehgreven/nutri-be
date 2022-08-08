import logger from '@src/logger';
import AuthService from '@src/services/auth.service';
import mongoose, { Document } from 'mongoose';
import { BaseModel } from '.';

export interface User extends BaseModel {
  name: string;
  email: string;
  password: string;
  profiles: string[];
  permissions: string[];
}

export interface ExistingUser extends User {
  id: string;
}

export enum CustomValidation {
  DUPLICATED = 'DUPLICATED',
}

const schema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    profiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
      },
    ],
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
        ret.profiles = ret.profiles.map((p: string) => p.toString());
        ret.permissions = ret.permissions.map((p: string) => p.toString());
      },
    },
  },
);

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CustomValidation.DUPLICATED,
);

schema.pre<User & Document>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (error) {
    logger.error(`Error hashing the use password ${this.name}`, error);
  }
});

export const User = mongoose.model<User>('User', schema);
