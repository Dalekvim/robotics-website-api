"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.PostResolver = void 0;
const auth_1 = require("../auth");
const Post_1 = require("../entities/Post");
const models_1 = require("../models");
const type_graphql_1 = require("type-graphql");
const mongoose_1 = require("mongoose");
let PostResolver = class PostResolver {
    posts() {
        return models_1.PostModel.find();
    }
    createPost(title, content, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!payload) {
                    throw new Error("no payload");
                }
                const author = payload.userId;
                if (!author) {
                    throw new Error("login to create a post");
                }
                yield models_1.PostModel.create({
                    author,
                    title,
                    content,
                });
            }
            catch (err) {
                console.error.bind(err);
                return false;
            }
            return true;
        });
    }
    deletePost(_id, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!payload) {
                    throw new Error("no payload");
                }
                yield varifyUser(payload, _id);
                yield models_1.PostModel.findByIdAndDelete(_id).exec();
            }
            catch (err) {
                console.error.bind(err);
                return false;
            }
            return true;
        });
    }
    updatePost(_id, title, content, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!payload) {
                    throw new Error("no payload");
                }
                yield varifyUser(payload, _id);
                yield models_1.PostModel.findByIdAndUpdate(_id, { title, content });
            }
            catch (err) {
                console.error.bind(err);
                return false;
            }
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Post_1.Post]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", mongoose_1.DocumentQuery)
], PostResolver.prototype, "posts", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("title")),
    __param(1, type_graphql_1.Arg("content")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("_id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("_id")),
    __param(1, type_graphql_1.Arg("title")),
    __param(2, type_graphql_1.Arg("content")),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
PostResolver = __decorate([
    type_graphql_1.Resolver()
], PostResolver);
exports.PostResolver = PostResolver;
const varifyUser = (payload, _id) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield models_1.PostModel.findById(_id);
    if (!post) {
        throw new Error("post not found");
    }
    if (!post.author) {
        throw new Error("posts must have an author");
    }
    const author = post.author;
    if (!author._id) {
        throw new Error("all users must have a unique id");
    }
    if (payload.userId != author._id) {
        throw new Error("wrong user");
    }
});
//# sourceMappingURL=Post.js.map