import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { JwtService } from "@nestjs/jwt";
import { UserNotFoundError } from "src/common/errors";
import type { JwtPayload } from "src/types";
import { Services } from "src/types/constants";
import { PasswordUtils } from "src/utils/password";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { type UserEntity, UserService } from "../user";
// biome-ignore lint/style/useImportType: <Cannot useImportType in DTOs>
import { UserLoginDTO } from "../user/user.dto";

@Injectable()
export class AuthService {
	public constructor(
		@Inject(Services.User) private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	public async validateUser(details: UserLoginDTO): Promise<UserEntity> {
		const user = await this.userService.findByDocument(details.document);
		if (await PasswordUtils.compare(details.password, user.password)) {
			return user;
		}

		throw new UserNotFoundError();
	}

	public async find(payload: JwtPayload) {
		const user = await this.userService.findByPublicId(payload.publicId);
		return user;
	}

	public async login(payload: JwtPayload): Promise<string> {
		const token = await this.jwtService.signAsync({ payload });
		return token;
	}
}
