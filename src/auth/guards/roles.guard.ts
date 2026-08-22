import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: string } }>();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: User role required');
    }

    const userRole = user.role.toLowerCase();
    const hasRole = requiredRoles.some(
      (role) =>
        userRole === role.toLowerCase() ||
        userRole === 'admin' ||
        userRole === 'superadmin',
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Requires ${requiredRoles.join(' or ')} permissions`,
      );
    }

    return true;
  }
}
