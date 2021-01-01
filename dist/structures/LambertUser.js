"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambertUser = void 0;
const discord_js_1 = require("discord.js");
const Auth_1 = require("./Auth");
const lambert_db_1 = require("lambert-db");
const util_1 = require("util");
class LambertUser {
    get data() {
        return lambert_db_1.Datastore(this.client.db, [{ name: "users", filter: { id: this.id } }]);
    }
}
exports.LambertUser = LambertUser;
util_1.inherits(discord_js_1.User, Auth_1.Auth);
util_1.inherits(discord_js_1.User, LambertUser);
util_1.inherits(discord_js_1.User, discord_js_1.Base);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFVzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW1iZXJ0VXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBd0M7QUFDeEMsaUNBQThCO0FBQzlCLDJDQUF1QztBQUN2QywrQkFBZ0M7QUFLaEMsTUFBYSxXQUFXO0lBQ3ZCLElBQVcsSUFBSTtRQUNkLE9BQU8sc0JBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7Q0FDRDtBQUpELGtDQUlDO0FBRUQsZUFBUSxDQUFDLGlCQUFJLEVBQUUsV0FBSSxDQUFDLENBQUM7QUFDckIsZUFBUSxDQUFDLGlCQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDNUIsZUFBUSxDQUFDLGlCQUFJLEVBQUUsaUJBQUksQ0FBQyxDQUFDIn0=