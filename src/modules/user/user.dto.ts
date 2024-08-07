import { PartialType, PickType } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { IsAlphanumeric, IsEmail, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { IsCPFOrCNPJ } from "src/common/decorators/IsCPFOrCNPJ.decorator";

export class UserDTO {
	@IsString()
	@IsNotEmpty()
	@Length(5, 50)
	public readonly firstName: string;

	@IsString()
	@IsNotEmpty()
	@Length(5, 100)
	public readonly lastName: string;

	@IsEmail()
	@IsNotEmpty()
	@Length(7, 255)
	public readonly email: string;

	@IsString()
	@IsNotEmpty()
	@Length(4, 50)
	public readonly password: string;

	@IsEnum($Enums.UserType)
	@IsNotEmpty()
	public readonly userType: $Enums.UserType;

	@IsAlphanumeric()
	@IsNotEmpty()
	@IsCPFOrCNPJ()
	public readonly document: string;
}

export class UserPartialDTO extends PartialType(UserDTO) {}

export class UserDocumentDTO extends PickType(UserDTO, ["document"] as const) {}

export class UserEmailDTO extends PickType(UserDTO, ["email"] as const) {}
