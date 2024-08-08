import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { Routes, Services } from "src/types/constants";
import type { IUserService } from ".";
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
	public async findByDocument(@Param() { document }: UserDocumentDTO, @Res() res: FastifyReply): Promise<void> {
		const user = await this.userService.findByDocument(document);

		return res.send({
			status: HttpStatus.OK,
			data: user,
		});
	}

	@Get("email/:email")
	public async findByEmail(@Param() { email }: UserEmailDTO, @Res() res: FastifyReply): Promise<void> {
		const user = await this.userService.findByEmail(email);

		return res.send({
			status: HttpStatus.OK,
			data: user,
		});
	}

	@Get(":id")
	public async findById(@Param("id") id: string, @Res() res: FastifyReply): Promise<void> {
		const user = await this.userService.findByPublicId(id);

		return res.send({
			status: HttpStatus.OK,
			data: user,
		});
	}

	@Get("list")
	public async list(@Res() res: FastifyReply) {
		const users = await this.userService.findMany();

		return res.send({
			status: HttpStatus.OK,
			count: await this.userService.count(),
			data: users,
		});
	}
}
