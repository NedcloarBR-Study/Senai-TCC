import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				secret: config.getOrThrow<string>("JWT_SECRET"),
				signOptions: {
					expiresIn: config.getOrThrow<string>("JWT_EXPIRE"),
				},
			}),
		}),
		PassportModule.register({
			session: true,
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [JwtStrategy, AuthService],
	exports: [AuthService],
})
export class AuthModule {}
