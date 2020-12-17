export class LambertError extends Error {
	constructor(public code: ERRORS, public data: any) {
		super(ERRORS[code]);
	}
}

export enum ERRORS {
	NOT_NSFW_CHANNEL,
	THROTTLED,
	GUILD_ONLY,
}
