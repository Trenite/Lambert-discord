export declare class Auth {
    abstract get data(): any;
    hasAuth(auth: string, throwError?: boolean): Promise<boolean>;
    hasAuths(auths: string[] | string, throwError?: boolean): Promise<boolean>;
    setAuth(auth: string, value: boolean): Promise<boolean>;
    getAuths(): Promise<any>;
}
//# sourceMappingURL=Auth.d.ts.map