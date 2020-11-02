import { Constants as DJConstants } from "discord.js";

var Constants = { ...DJConstants };
// @ts-ignore
Constants.Events = { ...Constants.Events, CLIENT_INIT: "clientInit" };

export { Constants };
