import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { JwtService } from "@nestjs/jwt";
import type { JwtPayload } from "src/types";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes used in Injection>
import { type UserEntity, UserService } from "../user";
import type { UserDTO } from "../user/user.dto";

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	public async validateUser(details: UserDTO): Promise<UserEntity> {
		const user = await this.userService.findByDocument(details.document);
		return user || (await this.userService.create(details));
	}

	public async find(payload: JwtPayload) {
		const user = await this.userService.findByPublicId(payload.id);
		return user;
	}

	public async login(payload: JwtPayload): Promise<string> {
		const token = await this.jwtService.signAsync({ payload });
		return token;
	}
}
