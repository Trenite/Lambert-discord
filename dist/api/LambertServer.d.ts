/// <reference types="node" />
import { LambertDiscordClient } from "../structures/LambertDiscordClient";
import express, { Application, NextFunction, Request, Response, Router } from "express";
import { Server } from "http";
import "express-async-errors";
import { Handler } from "../structures/Handler";
import { Module } from "../structures/Module";
export interface LambertServerOptions {
    port?: number;
    host?: string;
}
export declare class LambertServer extends Handler<Module> {
    client: LambertDiscordClient;
    options: LambertServerOptions;
    app: Application;
    http?: Server;
    paths: Map<string, Router>;
    constructor(client: LambertDiscordClient, options?: LambertServerOptions);
    init(): Promise<void>;
    handleError(error: string | Error, req: Request, res: Response, next: NextFunction): express.Response<any>;
    registerRoutes(root: string): Promise<unknown[]>;
    /**
     * @param root - The path from / to the actual routes directory -> Automatically creates a Router based on dir structure
     * @param file - The complete path to the file
     */
    registerRoute(root: string, file: string): any;
    destroy(): Promise<void>;
}
