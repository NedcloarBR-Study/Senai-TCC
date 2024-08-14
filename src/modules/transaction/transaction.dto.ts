import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class TransactionDTO {
	@IsNumber()
	@Min(0.01)
	@IsNotEmpty()
	public value: number;

	@IsString()
	@IsNotEmpty()
	public senderDocument: string;

	@IsString()
	@IsNotEmpty()
	public receiverDocument: string;
}
