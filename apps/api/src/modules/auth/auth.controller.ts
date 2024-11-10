import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthUser } from "src/common/decorators/AuthUser.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";
import type { UserEntity } from "../user";
// biome-ignore lint/style/useImportType: <Cannot useImportType on DTOs>
import { UserLoginDTO } from "../user/user.dto";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@Post("login")
	public async login(@Body() userLoginDTO: UserLoginDTO): Promise<string> {
		const user = await this.authService.validateUser(userLoginDTO);
		const jwt = await this.authService.login({ publicId: user.publicId });
		return jwt;
	}

	@Get("status")
	@UseGuards(JwtAuthGuard)
	public status(@AuthUser() user: UserEntity): UserEntity {
		return user;
	}
}
