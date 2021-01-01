export class LambertError extends Error {
	constructor(public code: ERRORS, public data: any) {
		super(ERRORS[code]);
	}

	getMessage(language: any) {} // TODO
}

export enum ERRORS {
	THROTTLED,
	GUILD_ONLY,
	DIFFERENT_GUILD,
	MISSING_PERMISSION,
	MISSING_PERMISSIONS,
	NOT_A_TYPE,
	NOT_A_NUMBER,
	NOT_A_STRING,
	NOT_A_BIGINT,
	NOT_A_BOOLEAN,
	NOT_A_CHANNEL,
	NOT_A_TEXTCHANNEL,
	NOT_A_CATEGORYCHANNEL,
	NOT_A_VOICECHANNEL,
	NOT_A_NSFW_CHANNEL,
	NOT_A_COMMAND,
	NOT_A_GUILD_MEMBER,
	NOT_A_USER,
	NOT_A_MESSAGE,
	NOT_A_ROLE,
}

export type ERRORS_NAMES = keyof typeof ERRORS;
