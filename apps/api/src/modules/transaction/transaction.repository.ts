import { Inject } from "@nestjs/common";
import type { CustomPrismaService } from "nestjs-prisma";
import { Services } from "src/types/constants";
import type { ITransactionRepository, TransactionEntity } from ".";
import type { ExtendedPrismaClient } from "../database/ExtendedPrismaClient";
import type { IUserService } from "../user";
import { TransactionDTO } from "./transaction.dto";

export class TransactionRepository implements ITransactionRepository {
	constructor(
		@Inject(Services.Prisma)
		private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
		@Inject(Services.User) private readonly userService: IUserService,
	) {}

	public async create(data: TransactionDTO): Promise<TransactionEntity> {
		const { publicId: senderId } = await this.userService.findByDocument(
			data.senderDocument,
		);

		const { publicId: receiverId } = await this.userService.findByDocument(
			data.receiverDocument,
		);

		const _data = {
			value: data.value,
			senderId,
			receiverId,
		};

		return await this.prisma.client.transaction.create({
			data: _data,
		});
	}
}
