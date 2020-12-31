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
const type_graphql_1 = require("type-graphql");
const models_1 = require("./models");
const types_1 = require("./types");
let CommentResolver = class CommentResolver {
    comments() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.commentModel.find();
        });
    }
    postComment(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = new models_1.commentModel({ content });
            return yield newComment.save();
        });
    }
    deleteComment(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.commentModel.deleteOne({ _id: _id });
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [types_1.Comment]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "comments", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.Comment),
    __param(0, type_graphql_1.Arg("content")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "postComment", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "deleteComment", null);
CommentResolver = __decorate([
    type_graphql_1.Resolver()
], CommentResolver);
exports.CommentResolver = CommentResolver;
//# sourceMappingURL=resolvers.js.map