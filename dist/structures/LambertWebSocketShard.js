"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambertWebSocketShard = void 0;
const discord_js_1 = require("discord.js");
const Constants_1 = require("./Constants");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFdlYlNvY2tldFNoYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvTGFtYmVydFdlYlNvY2tldFNoYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxjQUFjOzs7QUFFZCwyQ0FBOEQ7QUFDOUQsMkNBQXdDO0FBRXhDLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcscUJBQVMsQ0FBQztBQUV0RSxNQUFhLHFCQUFzQixTQUFRLDJCQUFjO0lBQ3hELFlBQVksT0FBZ0MsRUFBRSxFQUFVO1FBQ3ZELEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxJQUFTO1FBQ3ZCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDM0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDZDthQUFNO1lBQ04sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQjtJQUNGLENBQUM7SUFFTyxRQUFRLENBQUMsTUFBVztRQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsTUFBTSxJQUFJLENBQUMsQ0FBQztZQUNuRCxPQUFPO1NBQ1A7UUFFRCxRQUFRLE1BQU0sQ0FBQyxDQUFDLEVBQUU7WUFDakIsS0FBSyxRQUFRLENBQUMsT0FBTztnQkFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUUzQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN0QixNQUFNO1NBQ1A7UUFFRCxRQUFRLE1BQU0sQ0FBQyxFQUFFLEVBQUU7WUFDbEIsS0FBSyxPQUFPLENBQUMsZUFBZTtnQkFDM0Isc0JBQXNCO2dCQUN0QixNQUFNO1NBQ1A7UUFFRCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztDQUNEO0FBckNELHNEQXFDQyJ9