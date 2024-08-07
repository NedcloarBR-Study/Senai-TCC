import { Injectable } from "@nestjs/common";
import { user } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { type IUserRepository, type UserEntity } from ".";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserRepository implements IUserRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public async create(data: UserDTO): Promise<UserEntity> {
		const user = await this.prisma.user.create({ data });
		return (await this.safeQuery("Single", user)) as UserEntity;
	}

	public async findByPublicId(publicId: string): Promise<UserEntity> {
		const user = await this.prisma.user.findFirst({
			where: {
				publicId,
			},
		});

		return (await this.safeQuery("Single", user)) as UserEntity;
	}

	// public async findByDocument(document: string): Promise<UserEntity> {
	// 	const user = await this.prisma.user.findFirst({
	// 		where: {
	// 			document,
	// 		},
	// 	});

	// 	return (await this.safeQuery("Single", user)) as UserEntity;
	// }

	// public async findByEmail(email: string): Promise<UserEntity> {
	// 	const user = await this.prisma.user.findFirst({
	// 		where: {
	// 			email,
	// 		},
	// 	});

	// 	return (await this.safeQuery("Single", user)) as UserEntity;
	// }

	public async findMany(): Promise<UserEntity[]> {
		const users = await this.prisma.user.findMany();
		return (await this.safeQuery("All", users)) as UserEntity[];
	}

	public async count(): Promise<number> {
		return await this.prisma.user.count();
	}

	private async safeQuery(query: "All" | "Single", entity: user[] | user): Promise<UserEntity[] | UserEntity> {
		switch (query) {
			case "All": {
				return (entity as user[]).map((user) => {
					const { password, id, ...safeUser } = user;
					return safeUser;
				}) as UserEntity[];
			}

			case "Single": {
				const { password, id, ...safeUser } = entity as user;
				return safeUser as UserEntity;
			}
		}
	}
}
