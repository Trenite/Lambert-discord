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
const HTTPError_1 = require("./HTTPError");
const body_parser_1 = __importDefault(require("body-parser"));
require("express-async-errors");
const Handler_1 = require("../structures/Handler");
class LambertServer extends Handler_1.Handler {
    constructor(client, options = { port: 8080, host: "0.0.0.0" }) {
        super({ id: "server" });
        this.client = client;
        this.options = options;
        this.paths = new Map();
        this.app = express_1.default();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(body_parser_1.default.json());
            this.app.use((req, res, next) => {
                req.client = this.client;
                next();
            });
            yield this.registerRoutes(`${__dirname}/routes/`);
            this.app.use(this.handleError);
            this.client.emit(discord_js_1.Constants.Events.DEBUG, "[Server] waiting for discord client to get ready to prevent weird errors");
            yield new Promise((res) => this.client.once("ready", () => res(null)));
            yield new Promise((res) => {
                this.app.listen(this.options.port, this.options.host, () => res(null));
            });
            this.client.emit(discord_js_1.Constants.Events.DEBUG, `[Server] ready and listening on ${this.options.host}:${this.options.port}`);
        });
    }
    handleError(error, req, res, next) {
        if (error instanceof HTTPError_1.HTTPError) {
            return res.status(error.code).json({ error: error.title });
        }
        else if (error instanceof ReferenceError || error instanceof SyntaxError || error instanceof TypeError) {
            console.error(error);
            // TODO: display error in dev mode
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(400).json({ error: error.toString() });
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
        var _a, _b;
        if (root.endsWith("/") || root.endsWith("\\"))
            root = root.slice(0, -1); // removes slash at the end of the root dir
        let path = file.replace(root, ""); // remove root from path and
        path = path.split(".").slice(0, -1).join("."); // trancate .js/.ts file extension of path
        if (path.endsWith("index"))
            path = path.slice(0, "/index".length * -1); // delete index from path
        try {
            var router = require(file);
            if (router === null || router === void 0 ? void 0 : router.default)
                router = router.default;
            if (((_b = (_a = router === null || router === void 0 ? void 0 : router.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) !== "router")
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
                this.http ? this.http.close(res) : res(null);
            });
        });
    }
}
exports.LambertServer = LambertServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvTGFtYmVydFNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxzREFBd0Y7QUFFeEYsaUVBQThEO0FBQzlELDJDQUF1QztBQUN2QywyQ0FBd0M7QUFDeEMsOERBQXFDO0FBQ3JDLGdDQUE4QjtBQUM5QixtREFBZ0Q7QUFRaEQsTUFBYSxhQUFjLFNBQVEsaUJBQWU7SUFLakQsWUFDUSxNQUE0QixFQUM1QixVQUFnQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUV0RSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUhqQixXQUFNLEdBQU4sTUFBTSxDQUFzQjtRQUM1QixZQUFPLEdBQVAsT0FBTyxDQUF3RDtRQUpoRSxVQUFLLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFPN0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxpQkFBTyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVLLElBQUk7O1lBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDL0IsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUN6QixJQUFJLEVBQUUsQ0FBQztZQUNSLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsU0FBUyxVQUFVLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFL0IsSUFBSSxDQUFDLE1B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