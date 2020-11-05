import { Constants as DJConstants } from "discord.js";

// @ts-ignore
const Events = {
	CLIENT_INIT: "clientInit",
	SHARD_AUTHENTICATED: "shardAuthenticated",
	SHARD_INVALIDATED: "shardInvalidated",
};
var Constants = { ...DJConstants, Events: { ...DJConstants.Events, ...Events } };

export { Constants };
