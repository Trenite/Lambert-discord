"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandInteraction = void 0;
const discord_js_1 = require("discord.js");
const LambertTextBasedChannel_1 = require("./LambertTextBasedChannel");
const MessageTransformers_1 = require("./MessageTransformers");
class CommandInteraction extends discord_js_1.Base {
    constructor(client, data) {
        super(client);
        this.data = data;
        this._patch(data);
    }
    get valid() {
        // after 15 minutes the token expires
        if (Date.now() - this.started > 1000 * 60 * 15)
            throw new Error("Interaction token expired");
        return true;
    }
    _patch(data) {
        if (data.version !== 1)
            throw new Error("Unkown Interaction version");
        this.channel = this.client.channels.resolve(data.channel_id);
        this.guild = this.client.guilds.resolve(data.guild_id);
        this.id = data.id;
        this.member = this.guild.members.add(data.member);
        this.token = data.token;
        this.started = Date.now();
        this.command = this.client.registry.commands.modules.find((x) => x.slashId === data.data.id);
        if (!this.command)
            throw new Error("Slash Command not found");
    }
    getArgs() {
        return __awaiter(this, void 0, void 0, function* () {
            let args = {};
            yield Promise.all((this.data.data.options || []).map((opt) => __awaiter(this, void 0, void 0, function* () {
                let argument = this.command.args.find((arg) => arg.id === opt.name);
                if (!argument)
                    throw new Error("Argument not found");
                let val = yield argument.type.parse({ cmd: this.command, trigger: this, val: opt.value });
                // if (val == null) throw new Error("Couldn't parse argument value");
                args[opt.name] = val;
            }))); // TODO: parse sub args
            this.args = args;
            return args;
        });
    }
    ack(options, content, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.acknowledged)
                throw new Error("Already acknowledged message");
            this.acknowledged = true;
            if (!options)
                options = {};
            if (options.showUsage == null)
                options.showUsage = true;
            const resolved = yield discord_js_1.APIMessage.create(this.member, null, yield LambertTextBasedChannel_1.transformSend.call(this, content, msg))
                .resolveData()
                .resolveFiles();
            if (!resolved.data.tts)
                delete resolved.data.tts;
            if (!resolved.data.content)
                delete resolved.data.content;
            const data = MessageTransformers_1.removeNull(resolved.data);
            // if (data) data.flags = options.dm ? 64 : 0;
            const type = options.showUsage ? (data ? 4 : 5) : data ? 3 : 2;
            try {
                return this.client.api.interactions(this.id, this.token).callback.post({
                    data: {
                        type,
                        data: data,
                    },
                });
            }
            catch (error) {
                if (options.replyIfError) {
                    return this.reply(content, msg);
                }
            }
        });
    }
    reply(content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolved = yield discord_js_1.APIMessage.create(this.member, null, yield LambertTextBasedChannel_1.transformSend.call(this, content, options))
                .resolveData()
                .resolveFiles();
            const res = yield this.client.api.webhooks(this.client.options.application_id, this.token).post({
                auth: false,
                data: resolved.data,
                files: resolved.files,
            });
            return res;
        });
    }
}
exports.CommandInteraction = CommandInteraction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZEludGVyYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvQ29tbWFuZEludGVyYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLDJDQVNvQjtBQUlwQix1RUFBMEQ7QUFDMUQsK0RBQW1EO0FBbUNuRCxNQUFhLGtCQUFtQixTQUFRLGlCQUFJO0lBWTNDLFlBQVksTUFBNEIsRUFBVSxJQUFpQjtRQUNsRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFEbUMsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUdsRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUixxQ0FBcUM7UUFDckMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUU7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDN0YsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQWlCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxPQUFPLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FB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