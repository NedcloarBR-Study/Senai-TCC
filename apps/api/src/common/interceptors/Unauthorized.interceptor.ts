import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
	UnauthorizedException,
} from "@nestjs/common";
import { type Observable, catchError } from "rxjs";
import { UnauthorizedError } from "../errors";

@Injectable()
export class UnauthorizedInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<unknown>,
	): Observable<unknown> | Promise<Observable<unknown>> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof UnauthorizedError) {
					throw new UnauthorizedException(error.message);
				}
				throw error;
			}),
		);
	}
}
