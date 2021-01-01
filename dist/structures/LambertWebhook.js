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
exports.LambertWebhookClient = void 0;
const discord_js_1 = require("discord.js");
const discord_1 = require("../util/discord");
class LambertWebhookClient extends discord_js_1.WebhookClient {
    constructor(url) {
        const { token, id } = discord_1.getWebhookAuth(url);
        super(id, token);
    }
    editMessage(id, content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw new Error("please specify a message id");
            let apiMessage;
            if (content instanceof discord_js_1.APIMessage) {
                apiMessage = content.resolveData();
            }
            else {
                apiMessage = discord_js_1.APIMessage.create(this, content, options).resolveData();
                // @ts-ignore
                if (Array.isArray(apiMessage.data.content)) {
                    return Promise.all(apiMessage.split().map(this.send.bind(this)));
                }
            }
            const { data, files } = yield apiMessage.resolveFiles();
            return (
            // @ts-ignore
            this.client.api
                // @ts-ignore
                .webhooks(this.id, this.token)
                .messages(id)
                .patch({
                data,
                files,
                auth: false,
            })
                .then((d) => {
                // @ts-ignore
                const channel = this.client.channels ? this.client.channels.cache.get(d.channel_id) : undefined;
                if (!channel)
                    return d;
                return channel.messages.add(d, false);
            }));
        });
    }
}
exports.LambertWebhookClient = LambertWebhookClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFdlYmhvb2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW1iZXJ0V2ViaG9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBZ0c7QUFDaEcsNkNBQWlEO0FBRWpELE1BQWEsb0JBQXFCLFNBQVEsMEJBQWE7SUFDdEQsWUFBWSxHQUFXO1FBQ3RCLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEdBQUcsd0JBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFSyxXQUFXLENBQ2hCLEVBQVUsRUFDVixPQUE4RCxFQUM5RCxPQUErQjs7WUFFL0IsSUFBSSxDQUFDLEVBQUU7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ3hELElBQUksVUFBVSxDQUFDO1lBRWYsSUFBSSxPQUFPLFlBQVksdUJBQVUsRUFBRTtnQkFDbEMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUNuQztpQkFBTTtnQkFDTixVQUFVLEdBQUcsdUJBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBeUIsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzVGLGFBQWE7Z0JBQ2IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQzNDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakU7YUFDRDtZQUVELE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDeEQsT0FBTztZQUNOLGFBQWE7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7Z0JBQ2QsYUFBYTtpQkFDWixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2lCQUM3QixRQUFRLENBQUMsRUFBRSxDQUFDO2lCQUNaLEtBQUssQ0FBQztnQkFDTixJQUFJO2dCQUNKLEtBQUs7Z0JBQ0wsSUFBSSxFQUFFLEtBQUs7YUFDWCxDQUFDO2lCQUNELElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO2dCQUNoQixhQUFhO2dCQUNiLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNoRyxJQUFJLENBQUMsT0FBTztvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdkIsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNILENBQUM7S0FBQTtDQUNEO0FBNUNELG9EQTRDQyJ9