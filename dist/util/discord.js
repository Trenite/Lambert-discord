"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebhookAuth = exports.getShardId = void 0;
function getShardId(guildId, numShards) {
    let guild_id = BigInt(guildId);
    let num_shards = BigInt(numShards);
    return Number((guild_id >> BigInt(22)) % num_shards);
}
exports.getShardId = getShardId;
function getWebhookAuth(url) {
    const slashes = url.split("/");
    const token = slashes.last();
    const id = slashes[slashes.length - 2];
    return { token, id };
}
exports.getWebhookAuth = getWebhookAuth;
//# sourceMappingURL=discord.js.map