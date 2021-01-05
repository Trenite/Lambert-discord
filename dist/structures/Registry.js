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
exports.Registry = void 0;
const CommandDispatcher_1 = require("./CommandDispatcher");
const CommandHandler_1 = require("./CommandHandler");
const Handler_1 = require("./Handler");
const MessageTransformers_1 = require("./MessageTransformers");
const LanguageHandler_1 = require("./LanguageHandler");
class Registry {
    constructor({ client, commands, language }) {
        this.messageTransformers = [MessageTransformers_1.embedMessageTransformer];
        this.client = client;
        this.dispatcher = new CommandDispatcher_1.CommandDispatcher(client);
        this.commands = new CommandHandler_1.CommandHandler(Object.assign(Object.assign({}, commands), { registry: this }));
        this.languages = new LanguageHandler_1.LanguageHandler(language);
        this.inhibitors = new Handler_1.Handler({ id: "inhibitors" });
        this.events = new Handler_1.Handler({ id: "events" });
        this.types = new Handler_1.Handler({ id: "types" });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                this.commands.init(),
                this.events.init(),
                this.types.init(),
                this.inhibitors.init(),
                this.dispatcher.init(),
            ]);
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                this.commands.destroy(),
                this.events.destroy(),
                this.types.destroy(),
                this.inhibitors.destroy(),
                this.dispatcher.destroy(),
            ]);
        });
    }
    registerDefault() {
        return __awaiter(this, void 0, void 0, function* () {
            this.registerDefaultTypes(); // types need to be registered before commands
            return Promise.all([
                this.registerDefaultCommands(),
                this.registerDefaultInhibitors(),
                this.registerDefaultEvents(),
            ]);
        });
    }
    registerDefaultCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commands.loadAll(__dirname + "/commands/");
        });
    }
    registerDefaultTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.types.loadAll(__dirname + "/types/");
        });
    }
    registerDefaultInhibitors() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    registerDefaultEvents() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    transformMessage(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const transformer of this.messageTransformers) {
                try {
                    opts = yield transformer(opts);
                }
                catch (error) { }
            }
            return MessageTransformers_1.enforceLimits(opts);
        });
    }
}
exports.Registry = Registry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFJQSwyREFBd0Q7QUFDeEQscURBQXlFO0FBQ3pFLHVDQUFvQztBQUVwQywrREFBbUc7QUFFbkcsdURBQTRFO0FBZ0I1RSxNQUFhLFFBQVE7SUFVcEIsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFtQjtRQUZwRCx3QkFBbUIsR0FBeUIsQ0FBQyw2Q0FBdUIsQ0FBQyxDQUFDO1FBRzVFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksK0JBQWMsaUNBQU0sUUFBUSxLQUFFLFFBQVEsRUFBRSxJQUFJLElBQUcsQ0FBQztRQUNwRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksaUNBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksaUJBQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGlCQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUssSUFBSTs7WUFDVCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtnQkFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO2dCQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTthQUN0QixDQUFDLENBQUM7UUFDSixDQUFDO0tBQUE7SUFFSyxPQUFPOztZQUNaLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO2dCQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFO2FBQ3pCLENBQUMsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUVLLGVBQWU7O1lBQ3BCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsOENBQThDO1lBRTNFLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLHVCQUF1QixFQUFFO2dCQUM5QixJQUFJLENBQUMseUJBQXlCLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTthQUM1QixDQUFDLENBQUM7UUFDSixDQUFDO0tBQUE7SUFFSyx1QkFBdUI7O1lBQzVCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDO1FBQ3hELENBQUM7S0FBQTtJQUNLLG9CQUFvQjs7WUFDekIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUFBO0lBQ0sseUJBQXlCOzhEQUFJLENBQUM7S0FBQTtJQUM5QixxQkFBcUI7OERBQUksQ0FBQztLQUFBO0lBRTFCLGdCQUFnQixDQUFDLElBQW9COztZQUMxQyxLQUFLLE1BQU0sV0FBVyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDbkQsSUFBSTtvQkFDSCxJQUFJLEdBQUcsTUFBTSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQy9CO2dCQUFDLE9BQU8sS0FBSyxFQUFFLEdBQUU7YUFDbEI7WUFDRCxPQUFPLG1DQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQztLQUFBO0NBQ0Q7QUFuRUQsNEJBbUVDIn0=