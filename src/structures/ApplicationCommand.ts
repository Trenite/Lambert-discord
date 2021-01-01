export interface ApplicationCommand {
	id?: string; // not needed for posting, but returned while getting
	application_id?: string; // not needed for posting, but returned while getting
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
}

// ApplicationCommandOption https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoption
export interface ApplicationCommandOption {
	name: string;
	description: string;
	type: number;
	default?: boolean;
	required?: boolean;
	choices?: ApplicationCommandOptionChoice[];
	options?: ApplicationCommandOption[];
}

export enum ApplicationCommandOptionType {
	"SUB_COMMAND" = 1,
	"SUB_COMMAND_GROUP" = 2,
	"STRING" = 3,
	"INTEGER" = 4,
	"BOOLEAN" = 5,
	"USER" = 6,
	"CHANNEL" = 7,
	"ROLE" = 8,
}

export interface ApplicationCommandOptionChoice {
	name: string;
	value: string;
}

export interface ApplicationOptions {
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
}
