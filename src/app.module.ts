import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "nestjs-prisma";
import { UserModule } from "./modules";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule.forRoot({
			isGlobal: true,
		}),
		UserModule,
	],
})
export class AppModule {}
