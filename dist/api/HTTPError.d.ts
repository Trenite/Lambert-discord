export declare class HTTPError extends Error {
    title: string;
    code: number;
    constructor(title: string, code?: number);
}
