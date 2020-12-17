"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambertServer = void 0;
const express_1 = __importDefault(require("express"));
const traverseDirectory_1 = require("../util/traverseDirectory");
const discord_js_1 = require("discord.js");
const SlashBackslash = /[\/\\]/g;
class LambertServer {
    constructor(client, options = { port: 8080, host: "0.0.0.0" }) {
        this.client = client;
        this.options = options;
        this.paths = new Map();
        this.app = express_1.default();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.registerRoutes(`${__dirname}/routes/`);
            yield new Promise((res) => {
                this.app.listen(this.options.port, this.options.host, res);
            });
            this.client.emit(discord_js_1.Constants.Events.DEBUG, `[Server] listening on ${this.options.host}:${this.options.port}`);
        });
    }
    registerRoutes(root) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield traverseDirectory_1.traverseDirectory({ dirname: root, recursive: true }, this.registerRoute.bind(this, root));
        });
    }
    /**
     * @param root - The path from / to the actual routes directory -> Automatically creates a Router based on dir structure
     * @param file - The complete path to the file
     */
    registerRoute(root, file) {
        if (root.endsWith("/") || root.endsWith("\\"))
            root = root.slice(0, -1); // removes slash at the end of the root dir
        let path = file.replace(root, ""); // remove root from path and
        path = path.split(".").slice(0, -1).join("."); // trancate .js/.ts file extension of path
        if (path.endsWith("index"))
            path = path.slice(0, "/index".length * -1); // delete index from path
        try {
            var router = require(file);
            if (router.default)
                router = router.default;
            if (!router || router.prototype.constructor.name !== "router")
                throw `File doesn't export any default router`;
            this.app.use(path, router);
            this.client.emit(discord_js_1.Constants.Events.DEBUG, `[Server] Route ${path} registered`);
        }
        catch (error) {
            this.client.emit(discord_js_1.Constants.Events.ERROR, new Error(`[Server] Failed to register route ${file}: ${error}`));
        }
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((res) => {
                this.http ? this.http.close(res) : res();
            });
        });
    }
}
exports.LambertServer = LambertServer;
//# sourceMappingURL=LambertServer.js.map