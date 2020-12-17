import { Message, TextChannel, DMChannel, NewsChannel } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { LambertGuild, LambertGuildMember } from "./LambertExtended";
export declare class LambertMessage extends Message {
    guild: LambertGuild | null;
    readonly member: LambertGuildMember | null;
    constructor(client: LambertDiscordClient, data: any, channel: TextChannel | DMChannel | NewsChannel);
}
//# sourceMappingURL=LambertMessage.d.ts.map