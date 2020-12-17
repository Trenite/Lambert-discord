import { LambertDiscordClient } from "./client/LambertDiscordClient";
import { LambertWebSocketManager } from "./client/websocket/LambertWebSocketManager";
import { LambertWebSocketShard } from "./client/websocket/LambertWebSocketShard";
import { MongoDatabase } from "./controllers/MongodbProvider";
import { SyncDatabase } from "./controllers/SyncDatabase";
import { Command } from "./structures/Command";
import { Constants } from "./structures/Constants";
import { Datastore } from "./structures/Provider";
import { Inhibitor } from "./structures/Inhibitor";
import { LambertGuildMember } from "./structures/LambertExtended";
import { LambertGuild } from "./structures/LambertGuild";
import { LambertMessage } from "./structures/LambertMessage";
import { Listener } from "./structures/Listener";

export {
	LambertDiscordClient,
	LambertWebSocketShard,
	LambertWebSocketManager,
	LambertMessage,
	LambertGuild,
	LambertGuildMember,
	MongoDatabase,
	SyncDatabase,
	Listener,
	Inhibitor,
	Command,
	Constants,
	Datastore,
};

/**
 * ┌────────┐
 * │Database│
 * └────────┘
 *
 * Every Bot has its own database
 * Guild, Users Collection
 * Guild has members
 *
 */
