import mongoose from 'mongoose';
import { BaseModel } from '.';

export interface Permission extends BaseModel {
  allow: boolean;
  functionalityId: string;
}

export interface ExistingPermission extends Permission {
  id: string;
}

const schema = new mongoose.Schema(
  {
    allow: { type: Boolean, required: true, default: true },
    active: { type: Boolean, default: false },
    functionalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Functionality',
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        ret.functionalityId = ret.functionalityId.toString();
      },
    },
  },
);

export const Permission = mongoose.model<Permission>('Permission', schema);
