import { Inject, Injectable } from "@nestjs/common";
import { genSalt, hash } from "bcrypt";
import { Repositories } from "src/types/constants";
import { type IUserRepository, type IUserService, type UserEntity } from ".";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService implements IUserService {
	public constructor(@Inject(Repositories.User) private readonly userRepository: IUserRepository) {}

	public async create(data: UserDTO): Promise<UserEntity> {
		const hashedData = await this.hashData(data);
		return await this.userRepository.create(hashedData);
	}

	public async findByPublicId(publicId: string): Promise<UserEntity> {
		return await this.userRepository.findByPublicId(publicId);
	}

	public async findByDocument(document: string): Promise<UserEntity> {
		return await this.userRepository.findByDocument(document);
	}

	public async findByEmail(email: string): Promise<UserEntity> {
		return await this.userRepository.findByEmail(email);
	}

	public async findMany(): Promise<UserEntity[]> {
		return await this.userRepository.findMany();
	}

	public async count(): Promise<number> {
		return await this.userRepository.count();
	}

	private async hashData(data: UserDTO): Promise<UserDTO> {
		const salt = await genSalt();
		const { password, ...rest } = data;
		const hashedPassword = await hash(password, salt);
		return {
			password: hashedPassword,
			...rest,
		} as UserDTO;
	}
}
