import { Message } from "discord.js";
import { LambertDiscordClient } from "./LambertDiscordClient";
export declare class CommandDispatcher {
    private client;
    private cmdMessages;
    constructor(client: LambertDiscordClient);
    init(): void;
    onMessage(m: Message): Promise<void>;
    destroy(): void;
}
//# sourceMappingURL=CommandDispatcher.d.ts.map