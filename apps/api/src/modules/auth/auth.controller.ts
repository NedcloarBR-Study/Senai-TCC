import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { ConfigService } from "@nestjs/config";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AuthUser } from "src/common/decorators/AuthUser.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";
import type { UserEntity } from "../user";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	public constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@Get("login")
	@UseGuards(JwtAuthGuard)
	public login(): void {}

	@Get("redirect")
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard)
	// @Redirect(
	// 	isInProduction
	// 		? "http://localhost:4401/@me"
	// 		: "http://localhost:4400/auth/status",
	// )
	public async redirect(
		@Req() req: FastifyRequest,
		@Res() res: FastifyReply,
	): Promise<void> {
		const jwt = await this.authService.login({ id: req.user.publicId });
	}

	@Get("status")
	@UseGuards(JwtAuthGuard)
	public status(@AuthUser() user: UserEntity): UserEntity {
		return user;
	}
}
