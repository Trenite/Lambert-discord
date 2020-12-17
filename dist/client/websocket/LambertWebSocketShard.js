"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambertWebSocketShard = void 0;
const discord_js_1 = require("discord.js");
const Constants_1 = require("../../structures/Constants");
const { WSEvents, ShardEvents, OPCodes, WSCodes, Status } = Constants_1.Constants;
class LambertWebSocketShard extends discord_js_1.WebSocketShard {
    constructor(manager, id) {
        super(manager, id);
    }
    destroy(opts) {
        if (opts && opts.keepalive) {
            setTimeout(() => {
                super.destroy(opts);
            }, 1000 * 30);
        }
        else {
            super.destroy(opts);
        }
    }
    onPacket(packet) {
        if (!packet) {
            this.debug(`Received broken packet: '${packet}'.`);
            return;
        }
        switch (packet.t) {
            case WSEvents.RESUMED:
                this.status = Status.READY;
                this.emit(ShardEvents.ALL_READY);
                break;
        }
        switch (packet.op) {
            case OPCodes.INVALID_SESSION:
                // this.identifyNew();
                break;
        }
        return super.onPacket(packet);
    }
}
exports.LambertWebSocketShard = LambertWebSocketShard;
//# sourceMappingURL=LambertWebSocketShard.js.map