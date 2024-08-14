import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { Routes, Services } from "src/types/constants";
import type { ITransactionService, TransactionEntity } from ".";
import { TransactionDTO } from "./transaction.dto";

@Controller(Routes.Transaction)
export class TransactionsController {
	constructor(
		@Inject(Services.Transaction)
		private readonly service: ITransactionService,
	) {}

	@Get()
	public get(): { message: string } {
		return { message: "TransactionModule Controller" };
	}

	@Post()
	public async create(
		@Body() data: TransactionDTO,
	): Promise<TransactionEntity> {
		return await this.service.create(data);
	}
}
