import { ClientUser, Collection, Message, TextChannel } from "discord.js";
import { Command } from "./Command";
import { ERRORS, LambertError } from "./LambertError";
import { LambertGuildMember } from "./LambertExtended";
import { LambertDiscordClient } from "./LambertDiscordClient";
import { CommandInteraction, CommandTrigger } from "./CommandInteraction";
import { Argument } from "./Argument";

// TODO: create a class CommandTrigger so that both interaction and message event works

export class CommandDispatcher {
	private mention: RegExp;

	constructor(private client: LambertDiscordClient) {
		this.client = client;
	}

	init() {
		this.mention = new RegExp(`^<@!?${this.client.user?.id}>\\s?`, "i");
		this.client.on("message", this.onMessage);
		this.client.on("interactionCreate", this.onInteraction);
	}

	onInteraction = async (interaction: CommandInteraction) => {
		this.checkCmd({ trigger: interaction, cmd: interaction.command, args: null });
	};

	onMessage = async (message: Message) => {
		if (!message) return;
		if (!this.client) return;
		if (!this.client.user || !this.client.user.id) return;
		if (!message.author) return;
		if (message.author.system) return;
		if (message.author.id === this.client.user?.id) return;
		if (message.author.bot) return;

		let prefix = message.guild?.prefix ?? this.client.options.commandPrefix;
		const usedPrefix = message.content.startsWith(prefix);

		const wasMentioned = message.content.match(this.mention);
		if (wasMentioned) prefix = wasMentioned.first();
		if (!wasMentioned && !usedPrefix) return;
		message.prefix = prefix;

		const content = message.content.slice(prefix.length);
		const cmdName = content.split(" ").first();
		message.cmdName = cmdName;
		const args = content.slice(cmdName.length).trim();
		const cmd = <Command>this.client.registry.commands.getModule(cmdName);
		message.cmd = cmd;

		return this.checkCmd({ cmd, trigger: message, args });
	};

	async checkCmd({
		cmd,
		trigger,
		args,
	}: {
		cmd: Command;
		trigger: CommandTrigger;
		args: string | Record<string, Argument>;
	}) {
		if (!cmd || !(cmd instanceof Command)) return; // emit unkown cmd
		try {
			const throttleTime = cmd.throttle((<Message>trigger).author?.id || trigger.member?.id);
			if (throttleTime) {
				throw new LambertError(ERRORS.THROTTLED, { user: trigger, time: throttleTime });
			}

			const botMember = <LambertGuildMember | null>(
				trigger.guild?.members.resolve((<ClientUser>this.client.user).id)
			);
			if (botMember) await botMember.hasAuths(cmd.clientPermissions, true);
			if (trigger.member) await trigger.member.hasAuths(cmd.userPermissions, true);

			if ((<TextChannel>trigger.channel).nsfw && !cmd.nsfw)
				throw new LambertError(ERRORS.NOT_NSFW_CHANNEL, { command: cmd, trigger, channel: trigger.channel });

			if (!trigger.guild && cmd.guildOnly) throw new LambertError(ERRORS.GUILD_ONLY, { command: cmd, trigger });

			const parsedArgs = await cmd.getArgs({ cmd, trigger, args });

			// get arguments
			await cmd.exec(trigger, parsedArgs);
		} catch (error) {
			let content = "There was an error processing the command";
			let options = {};
			if (error instanceof LambertError) {
				if (!trigger.guild) {
					// -> trigger is a message in a dm channel
					trigger = <Message>trigger;
				} else {
				}
			}
			await trigger.ack({ showUsage: false, dm: true, replyIfError: true }, options).catch((e) => {});
		}
	}

	destroy() {
		this.client.off("message", this.onMessage);
	}
}
