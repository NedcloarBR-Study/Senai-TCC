import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CustomPrismaModule } from "nestjs-prisma";
import { UserModule } from "./modules";
import { extendedPrismaClient } from "./modules/database/ExtendedPrismaClient";
import { Services } from "./types/constants";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		CustomPrismaModule.forRootAsync({
			name: Services.Prisma,
			useFactory: () => {
				return extendedPrismaClient;
			},
			isGlobal: true,
		}),
		UserModule,
	],
})
export class AppModule {}
