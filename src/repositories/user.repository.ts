import { User } from '@src/generated/client';

import { prismaClient } from '@src/database';
import { ProfilePermission, UserPermission } from '@src/generated/client';

import { IUserRepository } from '.';
import { BaseRepository } from './repository';

export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor() {
    super(prismaClient.user);
  }

  findOneById(id: string): Promise<User | null> {
    return prismaClient.user.findFirst({
      where: { id },
    });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return prismaClient.user.findFirst({
      where: { username },
    });
  }

  async findAllPermissionsFromLoggedUser(
    userId: string,
  ): Promise<(UserPermission | ProfilePermission)[]> {
    const permissions = [];

    const user = await prismaClient.user.findFirst({
      where: { id: userId },
      include: {
        profiles: {
          include: {
            profile: true,
          },
          where: {
            active: true,
          },
        },
        permissions: {
          where: { allow: true },
          include: {
            functionality: {
              select: {
                id: true,
                name: true,
                path: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    permissions.push(...user.permissions);

    if (user.profiles.length) {
      for (const userProfile of user.profiles) {
        const { profile } = userProfile;
        const data = await prismaClient.profile.findFirst({
          where: { id: profile.id },
          include: {
            permissions: {
              where: { allow: true },
              include: {
                functionality: {
                  select: {
                    id: true,
                    name: true,
                    path: true,
                  },
                },
              },
            },
          },
        });
        if (data) {
          permissions.push(...data.permissions);
        }
      }
    }

    return permissions;
  }
}
