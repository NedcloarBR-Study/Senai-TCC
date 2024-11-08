import fastifyHelmet from "@fastify/helmet";
import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";

export function configureFastify(
	app: NestFastifyApplication,
	configService: ConfigService,
): void {
	const fastifyInstance = app.getHttpAdapter().getInstance();
	fastifyInstance
		.addHook("onRequest", async (req, res) => {
			// biome-ignore lint/complexity/useLiteralKeys: <"encrypted" is a private attribute>
			req.socket["encrypted"] = process.env.NODE_ENV === "production";
		})
		.decorateReply("setHeader", function (name: string, value: unknown) {
			this.header(name, value);
		})
		.decorateReply("end", function () {
			this.send("");
		});

	app.use(fastifyHelmet);
}
