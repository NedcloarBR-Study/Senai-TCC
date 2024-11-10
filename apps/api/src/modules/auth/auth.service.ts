import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { JwtService } from "@nestjs/jwt";
import { UserNotFoundError } from "src/common/errors";
import type { JwtPayload } from "src/types";
import { Services } from "src/types/constants";
import { PasswordUtils } from "src/utils/password";
import type { IAuthService } from ".";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection or DTOs>
import { IUserService, type UserEntity, UserLoginDTO } from "../user";

@Injectable()
export class AuthService implements IAuthService {
	public constructor(
		@Inject(Services.User) private readonly userService: IUserService,
		private readonly jwtService: JwtService,
	) {}

	public async validateUser(details: UserLoginDTO): Promise<UserEntity> {
		const user = await this.userService.findByDocument(details.document);
		if (await PasswordUtils.compare(details.password, user.password)) {
			return user;
		}

		throw new UserNotFoundError();
	}

	public async find(payload: JwtPayload): Promise<UserEntity> {
		const user = await this.userService.findByPublicId(payload.publicId);
		return user;
	}

	public async login(payload: JwtPayload): Promise<string> {
		const token = await this.jwtService.signAsync({ payload });
		return token;
	}
}
