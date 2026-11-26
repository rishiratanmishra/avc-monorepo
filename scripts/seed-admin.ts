import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import { getDatabase, users, userProfiles, userRoles } from "@repo/database";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@avcpethospital.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "AdminPassword123!";
const FIRST_NAME = "Platform";
const LAST_NAME = "Admin";

const hashOptions = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

async function seedAdmin() {
  const db = getDatabase();
  console.log(`Connecting to database to provision platform admin (${ADMIN_EMAIL})...`);

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  const passwordHash = await argon2.hash(ADMIN_PASSWORD, hashOptions);

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
    console.log(`User ${ADMIN_EMAIL} already exists (ID: ${userId}). Updating credentials and activating status...`);

    await db
      .update(users)
      .set({
        passwordHash,
        status: "active",
        emailVerifiedAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      })
      .where(eq(users.id, userId));
  } else {
    userId = randomUUID();
    console.log(`Creating new user ${ADMIN_EMAIL} (ID: ${userId})...`);

    await db.insert(users).values({
      id: userId,
      email: ADMIN_EMAIL,
      passwordHash,
      status: "active",
      emailVerifiedAt: new Date(),
      failedLoginAttempts: 0,
    });

    await db.insert(userProfiles).values({
      userId,
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      locale: "en-IN",
      timeZone: "Asia/Kolkata",
    });
  }

  // Ensure user has admin role
  const existingRoles = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, userId));

  const hasAdminRole = existingRoles.some((r) => r.roleCode === "admin");

  if (!hasAdminRole) {
    console.log(`Assigning platform 'admin' role to ${ADMIN_EMAIL}...`);
    await db.insert(userRoles).values({
      userId,
      roleCode: "admin",
      assignedByUserId: null,
    });
  } else {
    console.log(`User already holds platform 'admin' role.`);
  }

  console.log("\n==========================================");
  console.log("  PLATFORM ADMIN PROVISIONED SUCCESSFULLY ");
  console.log("==========================================");
  console.log(`Email:    ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log(`Scope:    platform (/manage/platform)`);
  console.log("==========================================\n");

  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error("Failed to seed platform admin:", error);
  process.exit(1);
});
