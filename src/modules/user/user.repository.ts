import { Inject, Injectable } from "@nestjs/common";
import { user } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { Services } from "src/types/constants";
import { type IUserRepository, type UserEntity } from ".";
import { ExtendedPrismaClient } from "../database/ExtendedPrismaClient";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserRepository implements IUserRepository {
	public constructor(
		@Inject(Services.Prisma)
		private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
	) {}

	public async create(data: UserDTO): Promise<UserEntity> {
		const user = await this.prisma.client.user.create({ data });
		return (await this.safeQuery("Single", user)) as UserEntity;
	}

	public async findByPublicId(publicId: string): Promise<UserEntity> {
		console.log(publicId);
		const user = await this.prisma.client.user.findFirstOrThrow({
			where: {
				publicId,
			},
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});

		return (await this.safeQuery("Single", user)) as UserEntity;
	}

	public async findByDocument(document: string): Promise<UserEntity> {
		const user = await this.prisma.client.user.findFirstOrThrow({
			where: {
				document,
			},
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});

		return (await this.safeQuery("Single", user)) as UserEntity;
	}

	public async findByEmail(email: string): Promise<UserEntity> {
		const user = await this.prisma.client.user.findFirstOrThrow({
			where: {
				email,
			},
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});

		return (await this.safeQuery("Single", user)) as UserEntity;
	}

	public async findMany(): Promise<UserEntity[]> {
		const users = await this.prisma.client.user.findMany({
			include: {
				receivedTransactions: true,
				sentTransactions: true,
			},
		});
		return (await this.safeQuery("All", users)) as UserEntity[];
	}

	public async update(document: string, money: number): Promise<UserEntity> {
		return await this.prisma.client.user.update({
			where: {
				document,
			},
			data: {
				money,
			},
		});
	}

	public async count(): Promise<number> {
		return await this.prisma.client.user.count();
	}

	private async safeQuery(
		query: "All" | "Single",
		entity: user[] | user,
	): Promise<UserEntity[] | UserEntity> {
		switch (query) {
			case "All":
				return (entity as user[]).map((user) => {
					const { password, id, ...safeUser } = user;
					return safeUser;
				}) as UserEntity[];

			case "Single": {
				const { password, id, ...safeUser } = entity as user;
				return safeUser as UserEntity;
			}
		}
	}
}
