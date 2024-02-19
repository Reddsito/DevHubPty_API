import { UseGuards, applyDecorators } from "@nestjs/common";
import { RoleProtected } from "./role-protected.decorator";
import { Role } from "@prisma/client";
import { JwtAccessAuthGuard } from "../guards/jwt_access.guard";
import { UserRoleGuard } from "../guards/user_role.guard";



export function Auth(...roles : Role[]) {
  
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards( JwtAccessAuthGuard, UserRoleGuard )
  )

}