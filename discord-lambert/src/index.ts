import { LambertDiscordClient } from "./client/LambertDiscordClient";

export { LambertDiscordClient };

/**
 * ┌────────┐
 * │Database│
 * └────────┘
 *
 * Every Bot has its own database
 * Guild, Users Collection
 * Guild has members
 *
 *
 *
 * ┌─────────┐
 * │Datastore│
 * └─────────┘
 *
 * @example:
 * guild.data.xp-enabled.get()
 *
 * @returns {Promise}
 *
 * @template Actions:
 * - delete() - deletes the property
 * - get() - gets the value of the property
 * - exists() - check if the property exists
 * - set(value) - sets the value for the property
 * - push(value) - inserts the value in the array
 * - find(identifier) - find any element that fulfills the function/has the value
 * - updateOne()
 * - filter(identifier) - find all element that fulfills the function
 * - concat(arr) - combines database with this array
 * - every(fn) - check if every element fulfills the function
 * - some(fn) - check if any element fulfills the function
 * - first() - gets the first element of the array
 * - last() - get the last element of the array
 * - random() - gets a random element of the array
 * - has() - checks
 *
 * @variation Identifier:
 * - value
 * - {id}
 * - function (warning much overhead)
 * - native mongodb cmds: $gt $lt $eq $ne
 *
 *
 *
 */
