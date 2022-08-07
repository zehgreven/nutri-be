import { Permission } from '@src/models/permission';
import { PermissionRepository } from '.';
import { DefaultMongoDBRepository } from './default-mongodb-repository';

export class PermissionMongoDBRepository
  extends DefaultMongoDBRepository<Permission>
  implements PermissionRepository
{
  constructor(private permissionModel = Permission) {
    super(permissionModel);
  }
}
