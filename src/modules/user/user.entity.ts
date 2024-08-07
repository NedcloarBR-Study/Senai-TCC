import type { user } from "@prisma/client";

export type UserEntity = Omit<user, "password" | "id">;
