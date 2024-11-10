import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Inject,
	Post,
	Res,
	UseGuards,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { AuthUser } from "src/common/decorators/AuthUser.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";
import { Routes, Services } from "src/types/constants";
import type { IAuthService } from ".";
// biome-ignore lint/style/useImportType: <Cannot useImportType on DTOs>
import { type UserEntity, UserLoginDTO } from "../user";

@Controller(Routes.Auth)
export class AuthController {
	public constructor(
		@Inject(Services.Auth) private readonly authService: IAuthService,
	) {}

	@Post("login")
	public async login(
		@Body() userLoginDTO: UserLoginDTO,
		@Res() res: FastifyReply,
	): Promise<string> {
		const user = await this.authService.validateUser(userLoginDTO);
		const jwt = await this.authService.login({ publicId: user.publicId });
		return res.status(HttpStatus.FOUND).send({ token: jwt });
	}

	@Get("status")
	@UseGuards(JwtAuthGuard)
	public status(@AuthUser() user: UserEntity): UserEntity {
		return user;
	}
}
