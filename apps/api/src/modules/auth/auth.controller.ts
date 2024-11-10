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
import {
	ApiBody,
	ApiFoundResponse,
	ApiNotFoundResponse,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import type { FastifyReply } from "fastify";
import { AuthUser } from "src/common/decorators/AuthUser.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";
import { Routes, Services } from "src/types/constants";
import type { IAuthService } from ".";
import { type UserEntity, UserLoginDTO } from "../user";

@Controller(Routes.Auth)
@ApiTags(Routes.User)
export class AuthController {
	public constructor(
		@Inject(Services.Auth) private readonly authService: IAuthService,
	) {}

	@Post("login")
	@ApiBody({
		type: UserLoginDTO,
	})
	@ApiFoundResponse({ status: HttpStatus.FOUND, description: "User Logged" })
	@ApiNotFoundResponse({
		status: HttpStatus.NOT_FOUND,
		description: "No User found with this credentials",
	})
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
	@ApiResponse({ status: HttpStatus.OK, description: "User status" })
	public status(@AuthUser() user: UserEntity): UserEntity {
		return user;
	}
}
