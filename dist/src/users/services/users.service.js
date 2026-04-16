"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const existing = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existing) {
            throw new common_1.ConflictException("Email already exists");
        }
        if (createUserDto.age < 0) {
            throw new common_1.BadRequestException("Age cannot be negative");
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.userRepository.save(user);
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["orders"],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        await this.ensureEmailIsUnique(updateUserDto.email, id);
        this.validateAge(updateUserDto.age);
        Object.assign(user, updateUserDto);
        await this.userRepository.save(user);
        return this.findOne(id);
    }
    async getProfile(id) {
        return this.findOne(id);
    }
    async updateProfile(id, updateProfileDto) {
        const user = await this.findOne(id);
        await this.ensureEmailIsUnique(updateProfileDto.email, id);
        this.validateAge(updateProfileDto.age);
        Object.assign(user, updateProfileDto);
        await this.userRepository.save(user);
        return this.findOne(id);
    }
    async findOrdersByUserId(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["orders", "orders.books"],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        return user.orders;
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }
    async ensureEmailIsUnique(email, currentUserId) {
        if (!email) {
            return;
        }
        const existing = await this.userRepository.findOne({
            where: { email },
        });
        if (existing && existing.id !== currentUserId) {
            throw new common_1.ConflictException("Email already in use");
        }
    }
    validateAge(age) {
        if (age !== undefined && age < 0) {
            throw new common_1.BadRequestException("Age cannot be negative");
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map