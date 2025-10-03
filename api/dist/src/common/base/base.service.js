"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
class BaseService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findById(id) {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`${this.getEntityName()} not found`);
        }
        return entity;
    }
    async findAll() {
        return this.repository.find();
    }
    async create(createDto) {
        const entity = this.repository.create(createDto);
        return this.repository.save(entity);
    }
    async update(id, updateDto) {
        await this.repository.update(id, updateDto);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`${this.getEntityName()} not found`);
        }
    }
    async exists(id) {
        const count = await this.repository.count({ where: { id } });
        return count > 0;
    }
    excludeFields(entity, fields) {
        const result = { ...entity };
        fields.forEach(field => delete result[field]);
        return result;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map