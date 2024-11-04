import { $Enums } from "@prisma/client";
import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from "class-validator";
import { UserDTO } from "src/modules/user/user.dto";
import { isCNPJ, isCPF } from "validation-br";

@ValidatorConstraint({ async: false })
export class IsCPFOrCNPJConstraint implements ValidatorConstraintInterface {
	private userType: $Enums.UserType;

	public validate(document: string, args: ValidationArguments) {
		if ((args.object as UserDTO).userType === "CNPJ") {
			this.userType = "CNPJ";
			return isCNPJ(document);
		}

		if (!(args.object as UserDTO).userType) {
			return isCNPJ(document) || isCPF(document);
		}

		this.userType = "CPF";
		return isCPF(document);
	}

	public defaultMessage() {
		if (this.userType) {
			return `document should be a valid ${this.userType}`;
		}
		return "document should be a valid CPF or CNPJ";
	}
}

export function IsCPFOrCNPJ(validationOptions?: ValidationOptions) {
	return (object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsCPFOrCNPJConstraint,
		});
	};
}
