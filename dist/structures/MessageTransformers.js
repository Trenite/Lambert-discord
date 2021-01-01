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
exports.removeNull = exports.enforceLimits = exports.embedMessageTransformer = exports.authors = exports.imageFormats = void 0;
exports.imageFormats = ["jpg", "jpeg", "png", "gif"];
exports.authors = {
    error: {
        iconURL: "https://cdn.discordapp.com/emojis/713500900546838640.png",
        name: "Error",
    },
    success: {
        iconURL: "https://cdn.discordapp.com/emojis/714235674533822515.gif",
        name: "Success",
    },
    wait: {
        iconURL: "https://cdn.discordapp.com/emojis/713500751350988850.gif",
    },
    warn: {
        iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/259/warning_26a0.png",
        name: "Warn",
    },
};
function embedMessageTransformer(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!opts)
            return opts;
        if (opts.type === "noembed")
            return opts;
        if (!opts.embed) {
            opts.embed = {
                description: opts.content,
            };
            delete opts.content;
        }
        if (!opts.embed.image)
            opts.embed.image = {};
        if (!opts.embed.author)
            opts.embed.author = {};
        if (!opts.embed.fields)
            opts.embed.fields = [];
        if (!opts.files)
            opts.files = [];
        const file = opts.files.first();
        if (file && exports.imageFormats.includes(file.name.split(".").last())) {
            opts.embed.image.url = `attachment://${file.name}`;
        }
        opts.embed.author = Object.assign(Object.assign({}, exports.authors[opts.type]), opts.embed.author);
        return opts;
    });
}
exports.embedMessageTransformer = embedMessageTransformer;
function limit(val, limit) {
    if (!val)
        return val;
    if (val.length <= limit)
        return val;
    return val.slice(0, limit - 4) + " ...";
}
function enforceLimits(opts) {
    // TODO: check total limit of 6000 chars
    if (!opts)
        return opts;
    if (!opts.embed)
        opts.embed = {};
    if (!opts.embed.author)
        opts.embed.author = {};
    if (!opts.embed.footer)
        opts.embed.footer = {};
    if (!opts.embed.fields)
        opts.embed.fields = [];
    if (!opts.files)
        opts.files = [];
    opts.content = limit(opts.content, 2000);
    opts.embed.author.name = limit(opts.embed.author.name, 256);
    opts.embed.footer.text = limit(opts.embed.footer.text, 2048);
    opts.embed.title = limit(opts.embed.title, 256);
    var fields = [];
    function limitField(field) {
        if (!field)
            return;
        field.name = limit(`${field.name}`, 256);
        field.value = `${field.value}`;
        if (field.value.length > 1024) {
            var i = field.value.slice(0, 1024).lastIndexOf("\n");
            if (i === -1) {
                i = 1024;
            }
            fields.push({ name: field.name, value: field.value.slice(0, i), inline: field.inline });
            limitField(Object.assign(Object.assign({}, field), { value: field.value.slice(i) }));
        }
        else {
            fields.push(field);
        }
    }
    opts.embed.fields.forEach(limitField);
    opts.embed.fields = fields;
    return removeNull(opts);
}
exports.enforceLimits = enforceLimits;
function removeNull(obj) {
    if (obj == null)
        return undefined;
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object")
            obj[key] = removeNull(obj[key]);
        if (obj[key] == null) {
            delete obj[key];
        }
    });
    if (!Object.keys(obj).length)
        return undefined;
    return obj;
}
exports.removeNull = removeNull;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZVRyYW5zZm9ybWVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL01lc3NhZ2VUcmFuc2Zvcm1lcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRWEsUUFBQSxZQUFZLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUU3QyxRQUFBLE9BQU8sR0FBRztJQUN0QixLQUFLLEVBQUU7UUFDTixPQUFPLEVBQUUsMERBQTBEO1FBQ25FLElBQUksRUFBRSxPQUFPO0tBQ2I7SUFDRCxPQUFPLEVBQUU7UUFDUixPQUFPLEVBQUUsMERBQTBEO1FBQ25FLElBQUksRUFBRSxTQUFTO0tBQ2Y7SUFDRCxJQUFJLEVBQUU7UUFDTCxPQUFPLEVBQUUsMERBQTBEO0tBQ25FO0lBQ0QsSUFBSSxFQUFFO1FBQ0wsT0FBTyxFQUFFLG9HQUFvRztRQUM3RyxJQUFJLEVBQUUsTUFBTTtLQUNaO0NBQ0QsQ0FBQztBQUVGLFNBQXNCLHVCQUF1QixDQUFDLElBQW9COztRQUNqRSxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3ZCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRztnQkFDWixXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDekIsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNwQjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7WUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtZQUFFLElBQUksQ0FBQyxLQUFL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