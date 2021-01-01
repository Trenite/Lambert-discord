import { TextChannel, MessageOptions, StringResolvable, CollectorFilter, AwaitMessagesOptions, Message, Collection } from "discord.js";
export interface LambertTextBasedChannel extends TextChannel {
}
export declare class LambertTextBasedChannel {
    send(oldSend: any, content: StringResolvable, options: MessageOptions): Promise<Message[] | Message>;
    awaitMessages(oldAwaitMessages: any, filter: CollectorFilter, options?: AwaitMessagesOptions): Promise<Message | Collection<string, Message>>;
}
export declare function transformSend(content: StringResolvable, options: MessageOptions): Promise<MessageOptions>;
