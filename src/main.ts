import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PrismaClientExceptionFilter } from "nestjs-prisma";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters";
import { HttpInterceptor } from "./common/interceptors";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	const logger = new Logger("main");
	const configModule = app.get<ConfigService>(ConfigService);
	const PORT = configModule.getOrThrow<number>("PORT");

	const { httpAdapter } = app.get(HttpAdapterHost);

	app.useGlobalFilters(new HttpExceptionFilter(), new PrismaClientExceptionFilter(httpAdapter));
	app.useGlobalInterceptors(new HttpInterceptor());
	app.useGlobalPipes(
		new ValidationPipe({
			always: true,
			forbidNonWhitelisted: true,
			whitelist: true,
			transform: true,
		}),
	);

	app.setGlobalPrefix("api");

	const swaggerConfig = new DocumentBuilder()
		.setTitle("NDIX")
		.setDescription("The API Documentation")
		.setVersion("1.0")
		.addTag("api")
		.build();

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("docs", app, swaggerDocument);

	try {
		await app.listen(PORT, "0.0.0.0");
		logger.log(`Listening to PORT: ${PORT} | URL: ${await app.getUrl()}`);
	} catch (error) {
		logger.error(error);
	}
}

bootstrap();
