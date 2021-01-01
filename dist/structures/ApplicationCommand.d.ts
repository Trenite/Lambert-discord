export interface ApplicationCommand {
    id?: string;
    application_id?: string;
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
}
export interface ApplicationCommandOption {
    name: string;
    description: string;
    type: number;
    default?: boolean;
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: ApplicationCommandOption[];
}
export declare enum ApplicationCommandOptionType {
    "SUB_COMMAND" = 1,
    "SUB_COMMAND_GROUP" = 2,
    "STRING" = 3,
    "INTEGER" = 4,
    "BOOLEAN" = 5,
    "USER" = 6,
    "CHANNEL" = 7,
    "ROLE" = 8
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
