import type { transaction } from "@prisma/client";

export class TransactionEntity implements transaction {
	public readonly id: string;

	public readonly value: number;

	public readonly timestamp: Date;

	public readonly senderId: string;

	public readonly receiverId: string;
}
