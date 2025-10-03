import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from './base.entity';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }
    return entity;
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async update(id: string, updateDto: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, updateDto as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } as FindOptionsWhere<T> });
    return count > 0;
  }

  protected abstract getEntityName(): string;

  protected excludeFields<K extends keyof T>(entity: T, fields: K[]): Omit<T, K> {
    const result = { ...entity };
    fields.forEach(field => delete result[field]);
    return result;
  }
}
