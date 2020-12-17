import { PermissionResolvable, BitFieldResolvable, PermissionString } from "discord.js";

// Lambert can store special/custom permissions in the DB for every GuildMember

export type LambertPermissionResolvable = LambertPermissionString | LambertPermissionString[];

export type LambertPermissionString = PermissionString | "DEV" | "OWNER";
