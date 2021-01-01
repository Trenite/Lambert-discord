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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY29yZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2Rpc2NvcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsU0FBZ0IsVUFBVSxDQUFDLE9BQWUsRUFBRSxTQUFpQjtJQUM1RCxJQUFJLFFBQVEsR0FBVyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsSUFBSSxVQUFVLEdBQVcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sTUFBTSxDQUFDLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFKRCxnQ0FJQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxHQUFXO0lBQ3pDLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDdEIsQ0FBQztBQUxELHdDQUtDIn0=