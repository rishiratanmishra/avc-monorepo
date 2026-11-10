import type { UserRoleCode } from "@repo/contracts/models/user";
import {
  auditLogs,
  getDatabase,
  roles,
  userRoles,
  users,
} from "@repo/database";
import { and, count, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { AppError } from "../../errors/app-error.js";

type Database = ReturnType<typeof getDatabase>;

export class RoleService {
  constructor(private readonly database: Database = getDatabase()) {}

  async assign(
    actorUserId: string,
    targetUserId: string,
    roleCode: UserRoleCode,
    requestId: string,
  ): Promise<void> {
    await this.database.transaction(async (transaction) => {
      await this.lockRole(transaction, "admin");
      await this.lockRole(transaction, roleCode);
      await this.assertAdministrator(transaction, actorUserId);
      await this.assertUserExists(transaction, targetUserId);

      const [existingRole] = await transaction
        .select({ userId: userRoles.userId })
        .from(userRoles)
        .where(
          and(
            eq(userRoles.userId, targetUserId),
            eq(userRoles.roleCode, roleCode),
          ),
        )
        .limit(1);

      if (existingRole) {
        return;
      }

      await transaction.insert(userRoles).values({
        userId: targetUserId,
        roleCode,
        assignedByUserId: actorUserId,
      });

      await transaction.insert(auditLogs).values({
        id: randomUUID(),
        actorUserId,
        targetUserId,
        action: `role.assigned.${roleCode}`,
        requestId,
      });
    });
  }

  async revoke(
    actorUserId: string,
    targetUserId: string,
    roleCode: UserRoleCode,
    requestId: string,
  ): Promise<void> {
    await this.database.transaction(async (transaction) => {
      await this.lockRole(transaction, "admin");
      await this.lockRole(transaction, roleCode);
      await this.assertAdministrator(transaction, actorUserId);

      const [existingRole] = await transaction
        .select({ userId: userRoles.userId })
        .from(userRoles)
        .where(
          and(
            eq(userRoles.userId, targetUserId),
            eq(userRoles.roleCode, roleCode),
          ),
        )
        .limit(1);

      if (!existingRole) {
        return;
      }

      if (roleCode === "admin") {
        const [administrators] = await transaction
          .select({ total: count() })
          .from(userRoles)
          .where(eq(userRoles.roleCode, "admin"));

        if (Number(administrators?.total ?? 0) <= 1) {
          throw new AppError(
            409,
            "LAST_ADMINISTRATOR",
            "The final administrator role cannot be removed",
          );
        }
      }

      await transaction
        .delete(userRoles)
        .where(
          and(
            eq(userRoles.userId, targetUserId),
            eq(userRoles.roleCode, roleCode),
          ),
        );

      await transaction.insert(auditLogs).values({
        id: randomUUID(),
        actorUserId,
        targetUserId,
        action: `role.revoked.${roleCode}`,
        requestId,
      });
    });
  }

  private async lockRole(
    transaction: Parameters<Parameters<Database["transaction"]>[0]>[0],
    roleCode: UserRoleCode,
  ): Promise<void> {
    const [role] = await transaction
      .select({ code: roles.code })
      .from(roles)
      .where(eq(roles.code, roleCode))
      .for("update")
      .limit(1);

    if (!role) {
      throw new AppError(404, "ROLE_NOT_FOUND", "Role was not found");
    }
  }

  private async assertAdministrator(
    transaction: Parameters<Parameters<Database["transaction"]>[0]>[0],
    userId: string,
  ): Promise<void> {
    const [administrator] = await transaction
      .select({ userId: userRoles.userId })
      .from(userRoles)
      .innerJoin(users, eq(userRoles.userId, users.id))
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.roleCode, "admin"),
          eq(users.status, "active"),
        ),
      )
      .limit(1);

    if (!administrator) {
      throw new AppError(403, "FORBIDDEN", "Administrator access is required");
    }
  }

  private async assertUserExists(
    transaction: Parameters<Parameters<Database["transaction"]>[0]>[0],
    userId: string,
  ): Promise<void> {
    const [user] = await transaction
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new AppError(404, "ACCOUNT_NOT_FOUND", "Account was not found");
    }
  }
}
