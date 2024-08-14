import type { TransactionEntity } from ".";
import type { TransactionDTO } from "./transaction.dto";

export interface ITransactionService {
	create(data: TransactionDTO): Promise<TransactionEntity>;
}

export interface ITransactionRepository {
	create(data: TransactionDTO): Promise<TransactionEntity>;
}
