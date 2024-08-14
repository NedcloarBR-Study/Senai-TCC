import { Module, Provider } from "@nestjs/common";
import { Repositories, Services } from "src/types/constants";
import {
	TransactionRepository,
	TransactionService,
	TransactionsController,
} from ".";
import { UserModule } from "../user/user.module";

const dependencies: Provider[] = [
	{
		provide: Services.Transaction,
		useClass: TransactionService,
	},
	{
		provide: Repositories.Transaction,
		useClass: TransactionRepository,
	},
];

@Module({
	imports: [UserModule],
	controllers: [TransactionsController],
	providers: [...dependencies],
	exports: [...dependencies],
})
export class TransactionModule {}
