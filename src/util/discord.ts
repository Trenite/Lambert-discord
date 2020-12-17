export function getShardId(guildId: String, numShards: number): number {
	let guild_id: bigint = BigInt(guildId);
	let num_shards: bigint = BigInt(numShards);
	return Number((guild_id >> BigInt(22)) % num_shards);
}

export function getWebhookAuth(url: string) {
	const slashes = url.split("/");
	const token = slashes.last();
	const id = slashes[slashes.length - 2];
	return { token, id };
}
