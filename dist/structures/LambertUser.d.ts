import { User } from "discord.js";
import { Auth } from "./Auth";
export interface LambertUser extends User {
}
export interface LambertUser extends Auth {
}
export declare class LambertUser {
    get data(): import("lambert-db/dist/Datastore").DatastoreInterface;
}
