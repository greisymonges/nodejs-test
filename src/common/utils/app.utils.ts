const PASSWORD_RULE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const PASSWORD_RULE_MESSAGE: string = 'Password must have at least 1 uppercase letter, lowercase letter, number and special character (#?!@$%^&*-).';

export const REGEX = {
    PASSWORD_RULE,
}

export const MESSAGES = {
    PASSWORD_RULE_MESSAGE,
}