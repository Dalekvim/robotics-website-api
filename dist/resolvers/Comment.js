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
exports.CommentResolver = void 0;
const auth_1 = require("../auth");
const Comment_1 = require("../entities/Comment");
const models_1 = require("../models");
const type_graphql_1 = require("type-graphql");
const mongoose_1 = require("mongoose");
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
                if (!payload) {
                    throw new Error("no payload");
                }
                const user = yield models_1.UserModel.findById(payload.userId).exec();
                if (!user) {
                    throw new Error("only admin can delete comments");
                }
                if (!user.isAdmin) {
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
};
__decorate([
    type_graphql_1.Query(() => [Comment_1.Comment]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", mongoose_1.DocumentQuery)
], CommentResolver.prototype, "comments", null);
__decorate([
    type_graphql_1.Mutation(() => Comment_1.Comment),
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
CommentResolver = __decorate([
    type_graphql_1.Resolver()
], CommentResolver);
exports.CommentResolver = CommentResolver;
//# sourceMappingURL=Comment.js.map