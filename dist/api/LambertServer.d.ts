/// <reference types="node" />
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Application, Router } from "express";
import { Server } from "http";
export interface LambertServerOptions {
    port?: number;
    host?: string;
}
export declare class LambertServer {
    client: LambertDiscordClient;
    options: LambertServerOptions;
    app: Application;
    http?: Server;
    paths: Map<string, Router>;
    constructor(client: LambertDiscordClient, options?: LambertServerOptions);
    init(): Promise<void>;
    registerRoutes(root: string): Promise<any[]>;
    /**
     * @param root - The path from / to the actual routes directory -> Automatically creates a Router based on dir structure
     * @param file - The complete path to the file
     */
    registerRoute(root: string, file: string): any;
    destroy(): Promise<void>;
}
//# sourceMappingURL=LambertServer.d.ts.map