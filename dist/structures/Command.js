"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const Argument_1 = require("./Argument");
const Handler_1 = require("./Handler");
class Command extends Handler_1.Handler {
    constructor(props) {
        super(props.id);
        this.aliases = [];
        this.description = "";
        this.details = "";
        this.guarded = false;
        this.guildOnly = false;
        this.hidden = false;
        this.nsfw = false;
        this._throttles = new Map();
        this._globalThrottle = { start: Date.now(), usages: 0, timeout: undefined };
        this.clientPermissions = [];
        this.userPermissions = [];
        this.aliases = props.aliases;
        this.description = props.description;
        this.details = props.details;
        this.guarded = props.guarded;
        this.guildOnly = props.guildOnly;
        this.hidden = props.hidden;
        this.nsfw = props.nsfw;
        this.throttling = props.throttling;
        this.globalThrottling = props.globalThrottling;
        this.clientPermissions = props.clientPermissions;
        this.userPermissions = props.userPermissions;
        this.args = props.args.map((x) => new Argument_1.Argument(x));
    }
    exec() {
        throw new Error("Please make a exec() method in command " + this.id);
    }
    throttle(userID) {
        // TODO: if owner, always return false
        const time = (start, duration) => {
            let t = ((Date.now() - start - 100 * 1000) / 1000) * -1;
            return t < 0 ? 0 : t;
        };
        if (this.globalThrottling) {
            let throttle = this._globalThrottle;
            if (!throttle) {
                throttle = {
                    start: Date.now(),
                    usages: 0,
                    timeout: this.client.setTimeout(() => {
                        this._globalThrottle = undefined;
                    }, this.globalThrottling.duration * 1000),
                };
            }
            if (throttle.usages++ > this.globalThrottling.usages)
                return time(throttle.start, this.globalThrottling.duration);
        }
        if (this.throttling) {
            let throttle = this._throttles.get(userID);
            if (!throttle) {
                throttle = {
                    start: Date.now(),
                    usages: 0,
                    timeout: this.client.setTimeout(() => {
                        this._throttles.delete(userID);
                    }, this.throttling.duration * 1000),
                };
                this._throttles.set(userID, throttle);
            }
            if (throttle.usages++ > this.throttling.usages)
                return time(throttle.start, this.throttling.duration);
        }
        return 0;
    }
    getModule(id) {
        if (this.id.toLowerCase() === id.toLowerCase())
            return this;
        if (this.aliases.includes(id.toLowerCase()))
            return this;
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map