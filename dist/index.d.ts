import { LambertDiscordClient } from "./structures/LambertDiscordClient";
import { LambertWebSocketManager } from "./structures/LambertWebSocketManager";
import { LambertWebSocketShard } from "./structures/LambertWebSocketShard";
import { SyncDatabase } from "./structures/SyncDatabase";
import { Command } from "./structures/Command";
import { Constants } from "./structures/Constants";
import { Inhibitor } from "./structures/Inhibitor";
import { LambertGuildMember } from "./structures/LambertExtended";
import { LambertGuild } from "./structures/LambertGuild";
import { LambertMessage } from "./structures/LambertMessage";
import { Listener } from "./structures/Listener";
export { LambertDiscordClient, LambertWebSocketShard, LambertWebSocketManager, LambertMessage, LambertGuild, LambertGuildMember, SyncDatabase, Listener, Inhibitor, Command, Constants, };
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
