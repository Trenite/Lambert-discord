"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argument = void 0;
class Argument {
    constructor(command, data) {
        this.command = command;
        this.id = data.id;
        this.type = command.client.registry.types.getModule(data.type);
        if (!this.type)
            throw new Error(`ArgumentType ${data.type} not found for command ${command.id}`);
        this.title = data.title;
        this.max = data.max;
        this.min = data.min;
        this.description = data.description;
        this.wait = data.wait;
        this.required = data.required;
        if (this.type.id === "union") {
            if (!data.default)
                throw new Error("Union type must have a default value");
            if (!Array.isArray(data.default))
                throw new Error("default value for unions must be an array of values");
            data.default = data.default.map((x) => {
                if (typeof x === "number")
                    return parseInt(`${x}`);
                if (typeof x === "string")
                    return x;
                throw new Error("All values in union default array must be an integer or a string");
            });
        }
        this.default = data.default;
    }
}
exports.Argument = Argument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXJndW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9Bcmd1bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxNQUFhLFFBQVE7SUFXcEIsWUFBbUIsT0FBZ0IsRUFBRSxJQUFxQjtRQUF2QyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2xDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFpQixPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSwwQkFBMEIsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFOUIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxPQUFPLEVBQUU7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztZQUMzRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQztZQUN6RyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtvQkFBRSxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25ELElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1lBQ3JGLENBQUMsQ0FBQyxDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDN0IsQ0FBQztDQUNEO0FBakNELDRCQWlDQyJ9