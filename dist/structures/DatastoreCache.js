"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatastoreCache = void 0;
class DatastoreCache {
    constructor(property, opts) {
        this.property = property;
        this.opts = opts;
    }
    init() { }
    delete() {
        this.cache = undefined;
        return this.property.delete();
    }
    set(value) {
        this.cache = value;
        return this.property.set(value);
    }
    get() {
        return this.cache;
    }
    exists() { }
    push(value) { }
    first() { }
    last() { }
    random() { }
    destroy() { }
}
exports.DatastoreCache = DatastoreCache;
//# sourceMappingURL=DatastoreCache.js.map