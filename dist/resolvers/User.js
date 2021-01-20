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
exports.UserResolver = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = require("../auth");
const LoginResponse_1 = require("../entities/LoginResponse");
const User_1 = require("../entities/User");
const models_1 = require("../models");
const type_graphql_1 = require("type-graphql");
let UserResolver = class UserResolver {
    members() {
        return models_1.UserModel.find();
    }
    currentUser({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.UserModel.findById(payload.userId).exec();
            }
            catch (_a) {
                throw new Error("Invalid accessToken.");
            }
        });
    }
    register(firstName, lastName, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcrypt_1.hash(password, 12);
                yield models_1.UserModel.create({
                    firstName: firstName,
                    lastName: lastName,
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
                throw new Error("Could not find that email.");
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
    updateName(_id, firstName, lastName, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.userId !== _id) {
                throw new Error("invalid token");
            }
            try {
                yield models_1.UserModel.findByIdAndUpdate(_id, {
                    firstName: firstName,
                    lastName: lastName,
                });
            }
            catch (err) {
                console.error.bind(err);
                return false;
            }
            return true;
        });
    }
    updateBio(bio, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payload) {
                throw new Error("invalid token");
            }
            try {
                yield models_1.UserModel.findByIdAndUpdate(payload.userId, { bio: bio });
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
    type_graphql_1.Query(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "members", null);
__decorate([
    type_graphql_1.Query(() => User_1.User),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "currentUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("firstName")),
    __param(1, type_graphql_1.Arg("lastName")),
    __param(2, type_graphql_1.Arg("email")),
    __param(3, type_graphql_1.Arg("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => LoginResponse_1.LoginResponse),
    __param(0, type_graphql_1.Arg("email")),
    __param(1, type_graphql_1.Arg("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("_id")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("_id")),
    __param(1, type_graphql_1.Arg("firstName")),
    __param(2, type_graphql_1.Arg("lastName")),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateName", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg("bio")), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateBio", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=User.js.map