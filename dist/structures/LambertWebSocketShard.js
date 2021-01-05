"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambertWebSocketShard = void 0;
const Constants_1 = require("./Constants");
const { WSEvents, ShardEvents, OPCodes, WSCodes, Status } = Constants_1.Constants;
try {
    var WebSocketShard = require("../../../discord.js/src/client/websocket/WebSocketShard");
}
catch (error) {
    var WebSocketShard = require("../../node_modules/discord.js/src/client/websocket/WebSocketShard");
}
class LambertWebSocketShard {
    destroy(opts) {
        if (opts && opts.keepalive) {
            setTimeout(() => {
                destroy.call(this, opts);
            }, 1000 * 30);
        }
        else {
            destroy.call(this, opts);
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
                this.emit("allReady");
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
const destroy = WebSocketShard.prototype.destroy;
WebSocketShard.prototype.destroy = LambertWebSocketShard.prototype.destroy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFdlYlNvY2tldFNoYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvTGFtYmVydFdlYlNvY2tldFNoYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDJDQUF3QztBQUN4QyxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLHFCQUFTLENBQUM7QUFFdEUsSUFBSTtJQUNILElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO0NBQ3hGO0FBQUMsT0FBTyxLQUFLLEVBQUU7SUFDZixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsbUVBQW1FLENBQUMsQ0FBQztDQUNsRztBQUlELE1BQWEscUJBQXFCO0lBRzFCLE9BQU8sQ0FBQyxJQUFTO1FBQ3ZCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDM0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ2Q7YUFBTTtZQUNOLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pCO0lBQ0YsQ0FBQztJQUVPLFFBQVEsQ0FBQyxNQUFXO1FBQzNCLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWixJQUFJLENBQUMsS0FBSyxDQUFDLDRCQUE0QixNQUFNLElBQUksQ0FBQyxDQUFDO1lBQ25ELE9BQU87U0FDUDtRQUVELFFBQVEsTUFBTSxDQUFDLENBQUMsRUFBRTtZQUNqQixLQUFLLFFBQVEsQ0FBQyxPQUFPO2dCQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBRTNCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3RCLE1BQU07U0FDUDtRQUVELFFBQVEsTUFBTSxDQUFDLEVBQUUsRUFBRTtZQUNsQixLQUFLLE9BQU8sQ0FBQyxlQUFlO2dCQUMzQixzQkFBc0I7Z0JBQ3RCLE1BQU07U0FDUDtRQUVELE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0NBQ0Q7QUFuQ0Qsc0RBbUNDO0FBRUQsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7QUFDakQsY0FBYyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyJ9