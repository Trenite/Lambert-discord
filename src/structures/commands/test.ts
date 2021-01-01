import { Command } from "../Command";
import { Handler } from "../Handler";
import { CommandTrigger } from "../CommandInteraction";

export class test extends Command {
	constructor(handler: Handler<Command>) {
		super({
			handler,
			id: "test",
			description: "test command",
			aliases: ["hi"],
			args: [
				// {
				// 	id: "member",
				// 	type: "member",
				// 	description: "test arg",
				// 	required: true,
				// },
				// {
				// 	id: "bigint",
				// 	type: "bigint",
				// 	description: "bigint",
				// 	required: true,
				// },
				// {
				// 	id: "boolean",
				// 	type: "boolean",
				// 	description: "boolean",
				// 	required: true,
				// },
				// {
				// 	id: "channel",
				// 	type: "channel",
				// 	description: "channel",
				// 	required: true,
				// },
				// {
				// 	id: "integer",
				// 	type: "integer",
				// 	description: "integer",
				// 	required: true,
				// },
				// {
				// 	id: "categorychannel",
				// 	type: "categorychannel",
				// 	description: "categorychannel",
				// 	required: true,
				// },
				// {
				// 	id: "command",
				// 	type: "command",
				// 	description: "command",
				// 	required: true,
				// },
				// {
				// 	id: "message",
				// 	type: "message",
				// 	description: "message",
				// 	required: true,
				// },
				// {
				// 	id: "number",
				// 	type: "number",
				// 	description: "number",
				// 	required: true,
				// },
				// {
				// 	id: "role",
				// 	type: "role",
				// 	description: "role",
				// 	required: true,
				// },
				{
					id: "string",
					type: "string",
					description: "string",
					required: true,
				},
				// {
				// 	id: "subcommand",
				// 	type: "subcommand",
				// 	description: "subcommand",
				// },
				{
					id: "textchannel",
					type: "textchannel",
					description: "textchannel",
					required: true,
				},
				{
					id: "union",
					type: "union",
					description: "union",
					default: ["test", "hello"],
					required: true,
				},
				{
					id: "user",
					type: "user",
					description: "user",
					required: true,
				},
				{
					id: "voicechannel",
					type: "voicechannel",
					description: "voicechannel",
					required: true,
				},
			],
		});
	}

	async exec(trigger: CommandTrigger, args: any) {
		await trigger.ack({ showUsage: true }, "hi");
		console.log(args);
	}
}
