export class HTTPError extends Error {
	constructor(public title: string, public code: number = 400) {
		super(title);
	}
}
