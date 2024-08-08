import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { Routes, Services } from "src/types/constants";
import type { IUserService, UserEntity } from ".";
import { UserDTO, UserDocumentDTO, UserEmailDTO } from "./user.dto";

@Controller(Routes.User)
export class UserController {
	public constructor(@Inject(Services.User) private readonly userService: IUserService) {}

	@Get()
	public get(): string {
		return "UserModule Controller";
	}

	@Post()
	public async create(@Body() data: UserDTO) {
		return await this.userService.create(data);
	}

	@Get("document/:document")
	public async findByDocument(@Param() { document }: UserDocumentDTO): Promise<{ data: UserEntity }> {
		const user = await this.userService.findByDocument(document);

		return {
			data: user,
		};
	}

	@Get("email/:email")
	public async findByEmail(@Param() { email }: UserEmailDTO): Promise<{ data: UserEntity }> {
		const user = await this.userService.findByEmail(email);

		return {
			data: user,
		};
	}

	@Get(":id")
	public async findById(@Param("id") id: string): Promise<{ data: UserEntity }> {
		const user = await this.userService.findByPublicId(id);

		return {
			data: user,
		};
	}

	@Get("list")
	public async list(): Promise<{ count: number; data: UserEntity[] }> {
		const users = await this.userService.findMany();

		return {
			count: await this.userService.count(),
			data: users,
		};
	}
}
