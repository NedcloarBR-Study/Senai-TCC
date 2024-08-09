import { join } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { CustomPrismaModule } from "nestjs-prisma";
import { UserModule } from "./modules";
import { extendedPrismaClient } from "./modules/database/ExtendedPrismaClient";
import { Services } from "./types/constants";

@Module({
	imports: [
		ServeStaticModule.forRoot({
			serveRoot: "/",
			rootPath: join(__dirname, "..", "public"),
			exclude: ["/api/(.*)"],
		}),
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
