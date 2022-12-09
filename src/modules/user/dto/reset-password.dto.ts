import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

import { Match } from "src/common/decorator";
import { MESSAGES, REGEX } from "src/common/utils";

export class ResetPasswordDto {
    @IsString()
    token: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    password: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    @Match('password')
    confirm?: String;
}