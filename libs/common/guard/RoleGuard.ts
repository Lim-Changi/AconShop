import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

export const RoleGuard = (userRoles: UserRole[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return userRoles.includes(user?.role);
    }
  }

  return mixin(RoleGuardMixin);
};
