"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.PostModel = exports.CommentModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const Comment_1 = require("./entities/Comment");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
exports.CommentModel = typegoose_1.getModelForClass(Comment_1.Comment);
exports.PostModel = typegoose_1.getModelForClass(Post_1.Post, {
    schemaOptions: { timestamps: true },
});
exports.UserModel = typegoose_1.getModelForClass(User_1.User);
//# sourceMappingURL=models.js.map