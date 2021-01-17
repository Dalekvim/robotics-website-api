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
exports.MemberResolver = exports.PostResolver = exports.CommentResolver = void 0;
require("dotenv/config");
const type_graphql_1 = require("type-graphql");
const models_1 = require("./models");
const entities_1 = require("./entities");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = require("./auth");
let CommentResolver = class CommentResolver {
    comments() {
        return models_1.CommentModel.find();
    }
    createComment(content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.CommentModel.create({ content });
        });
    }
    deleteComment(_id, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.UserModel.findById(payload.userId).exec();
                if (!user) {
                    throw new Error("only admin can delete comments");
                }
                if (!user.admin) {
                    return false;
                }
                yield models_1.CommentModel.findByIdAndDelete(_id);
            }
            catch (err) {
                console.error.bind(err);
                return false;
            }
            return true;
        });
    }
    updateComment(_id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield models_1.CommentModel.findByIdAndUpdate(_id, { content: content });
            }
            catch (err) {
                console.error.bind(err);
                return true;
            }
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [entities_1.Comment]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "comments", null);
__decorate([
    type_graphql_1.Mutation(() => entities_1.Comment),
    __param(0, type_graphql_1.Arg("content")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "createComment", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("_id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "deleteComment", null);
__decorate([
    __param(0, type_graphql_1.Arg("_id")),
    __param(1, type_graphql_1.Arg("content")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "updateComment", null);
CommentResolver = __decorate([
    type_graphql_1.Resolver()
], CommentResolver);
exports.CommentResolver = CommentResolver;
let PostResolver = class PostResolver {
    posts() {
        return models_1.PostModel.find();
    }
    createPost(title, content, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const author = yield models_1.UserModel.findById(payload.userId).exec();
                if (!author) {
                    throw new Error("login to create a post");
                }
                yield models_1.PostModel.create({ author, title, content });
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
    type_graphql_1.Query(() => [entities_1.Post]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
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
PostResolver = __decorate([
    type_graphql_1.Resolver()
], PostResolver);
exports.PostResolver = PostResolver;
let MemberResolver = class MemberResolver {
    members() {
        return models_1.UserModel.find();
    }
    register(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcrypt_1.hash(password, 12);
                yield models_1.UserModel.create({
                    username: username,
                    email: email,
                    password: hashedPassword,
                });
            }
            catch (err) {
                console.error.bind(err);
                return false;
            }
            return true;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield models_1.UserModel.findOne({ email: email });
            if (!member) {
                throw new Error("Could not find that member.");
            }
            const valid = yield bcrypt_1.compare(password, member.password);
            if (!valid) {
                throw new Error("Bad password!");
            }
            return {
                accessToken: jsonwebtoken_1.sign({ userId: member._id }, process.env.SECRET, {
                    expiresIn: "15m",
                }),
                user: member,
            };
        });
    }
    changePassword(_id, password, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.hash(password, 12);
            try {
                if (payload.userId !== _id) {
                    throw new Error("wrong user");
                }
                yield models_1.UserModel.findByIdAndUpdate(_id, {
                    password: hashedPassword,
                });
            }
            catch (err) {
                console.error.bind(err);
            }
        });
    }
    updateUsername(_id, username, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.userId !== _id) {
                throw new Error("invalid token");
            }
            try {
                yield models_1.UserModel.findByIdAndUpdate(_id, { username: username });
            }
            catch (err) {
                console.error.bind(err);
                return false;
            }
            return true;
        });
    }
    updateBio(_id, bio, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.userId !== _id) {
                throw new Error("invalid token");
            }
            try {
                yield models_1.UserModel.findByIdAndUpdate(_id, { bio: bio });
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
    type_graphql_1.Query(() => [entities_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemberResolver.prototype, "members", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("username")),
    __param(1, type_graphql_1.Arg("email")),
    __param(2, type_graphql_1.Arg("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => entities_1.LoginResponse),
    __param(0, type_graphql_1.Arg("email")),
    __param(1, type_graphql_1.Arg("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("_id")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "changePassword", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("_id")),
    __param(1, type_graphql_1.Arg("username")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "updateUsername", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("_id")),
    __param(1, type_graphql_1.Arg("bio")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "updateBio", null);
MemberResolver = __decorate([
    type_graphql_1.Resolver()
], MemberResolver);
exports.MemberResolver = MemberResolver;
//# sourceMappingURL=resolvers.js.map