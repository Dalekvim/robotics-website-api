"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.PostModel = exports.CommentModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const entities_1 = require("./entities");
exports.CommentModel = typegoose_1.getModelForClass(entities_1.Comment);
exports.PostModel = typegoose_1.getModelForClass(entities_1.Post);
exports.UserModel = typegoose_1.getModelForClass(entities_1.User);
//# sourceMappingURL=models.js.map