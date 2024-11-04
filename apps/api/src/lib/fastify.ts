import { NestFastifyApplication } from "@nestjs/platform-fastify";

export function configureFastify(app: NestFastifyApplication): void {
    const fastifyInstance = app.getHttpAdapter().getInstance();
	fastifyInstance
		.addHook("onRequest", async (req, res) => {
			req.socket["encrypted"] = process.env.NODE_ENV === "production";
		})
		.decorateReply("setHeader", function (name: string, value: unknown) {
			this.header(name, value);
		})
		.decorateReply("end", function () {
			this.send("");
		});
}