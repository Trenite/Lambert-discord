import { Collection } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { ArgumentType } from "./ArgumentType";
import { Command } from "./Command";
import { CommandGroup } from "./CommandGroup";
import { Inhibitor } from "./Inhibitor";

export class Registry {
	public commands: Collection<string, Command> = new Collection();
	public groups: Collection<string, CommandGroup> = new Collection();
	public types: Collection<string, ArgumentType> = new Collection();
	public inhibitor: Collection<string, Inhibitor> = new Collection();
	public listeners: Collection<string, Inhibitor> = new Collection();

	constructor(client: LambertDiscordClient) {}
}
