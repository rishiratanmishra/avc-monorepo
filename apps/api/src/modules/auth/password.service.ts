import argon2 from "argon2";
import { randomBytes } from "node:crypto";

const hashOptions = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

const dummyHashPromise = argon2.hash(
  randomBytes(32).toString("hex"),
  hashOptions,
);

export class PasswordService {
  hash(password: string): Promise<string> {
    return argon2.hash(password, hashOptions);
  }

  async verify(password: string, passwordHash?: string): Promise<boolean> {
    const hash = passwordHash ?? (await dummyHashPromise);
    const verified = await argon2.verify(hash, password);
    return passwordHash !== undefined && verified;
  }
}
