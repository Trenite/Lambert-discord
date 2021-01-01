"use strict";
// @ts-nocheck
function inherits(subC, superC) {
    var subProto = Object.create(superC.prototype);
    // At the very least, we keep the "constructor" property
    // At most, we preserve additions that have already been made
    copyOwnFrom(subProto, subC.prototype);
    setUpHomeObjects(subProto);
    subC.prototype = subProto;
}
function ssuper(func) {
    return Object.getPrototypeOf(func.__homeObject__);
}
function setUpHomeObjects(obj) {
    Object.getOwnPropertyNames(obj).forEach(function (key) {
        var value = obj[key];
        if (typeof value === "function" && value.name === "me") {
            value.__homeObject__ = obj;
        }
    });
}
function copyOwnFrom(target, source) {
    Object.getOwnPropertyNames(source).forEach(function (propName) {
        Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
    });
    return target;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5oZXJpdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9pbmhlcml0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsY0FBYztBQUNkLFNBQVMsUUFBUSxDQUFDLElBQVMsRUFBRSxNQUFXO0lBQ3ZDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLHdEQUF3RDtJQUN4RCw2REFBNkQ7SUFDN0QsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFDM0IsQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFDLElBQUk7SUFDbkIsT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFHO0lBQzVCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHO1FBQ3BELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLE9BQU8sS0FBSyxLQUFLLFVBQVUsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUN2RCxLQUFLLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztTQUMzQjtJQUNGLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNO0lBQ2xDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxRQUFRO1FBQzVELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUYsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLE1BQU0sQ0FBQztBQUNmLENBQUMifQ==