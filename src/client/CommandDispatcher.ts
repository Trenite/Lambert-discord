import { ClientUser, Collection, Message, TextChannel } from "discord.js";
import { Command } from "../structures/Command";
import { ERRORS, LambertError } from "../structures/LambertError";
import { LambertGuildMember } from "../structures/LambertExtended";
import { LambertMessage } from "../structures/LambertMessage";
import { LambertDiscordClient } from "./LambertDiscordClient";

export class CommandDispatcher {
	private cmdMessages: Collection<string, Message> = new Collection();
	constructor(private client: LambertDiscordClient) {}

	init() {
		this.client.on("message", this.onMessage);
	}

	async onMessage(m: Message) {
		const message = <LambertMessage>m;
		if (!message) return;
		if (!message.author) return;
		if (message.author.system) return;
		if (message.author.id === this.client.user?.id) return;
		if (message.author.bot) return;

		let prefix = message.guild?.prefix ?? this.client.options.commandPrefix;
		const usedPrefix = message.content.startsWith(prefix);

		const mention = `<@${this.client.user?.id}`;
		const wasMentioned = message.content.startsWith(mention);
		if (wasMentioned) prefix = mention;
		if (!wasMentioned && !usedPrefix) return;

		const cmdName = message.content.slice(prefix.length);
		const cmd = this.client.registry.commands.getModule(cmdName);
		const command = cmd;
		if (!cmd || !(cmd instanceof Command)) return; // emit unkown cmd

		const throttleTime = cmd.throttle(message.author.id);
		if (throttleTime) {
			throw new LambertError(ERRORS.THROTTLED, { user: message.author, time: throttleTime });
		}

		const botMember = <LambertGuildMember>message.guild?.members.resolve((<ClientUser>this.client.user).id);
		if (botMember) await botMember.hasAuths(cmd.clientPermissions, true);
		if (message.member) await message.member.hasAuths(cmd.userPermissions, true);

		if ((<TextChannel>message.channel).nsfw && !cmd.nsfw)
			throw new LambertError(ERRORS.NOT_NSFW_CHANNEL, { command, message, channel: message.channel });

		if (!message.guild && cmd.guildOnly) throw new LambertError(ERRORS.GUILD_ONLY, { command, message });

		// get arguments
		cmd.exec();
	}

	destroy() {
		this.client.off("message", this.onMessage);
	}
}
