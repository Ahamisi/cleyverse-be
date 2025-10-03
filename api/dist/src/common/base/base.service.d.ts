import { Repository, DeepPartial } from 'typeorm';
import { BaseEntity } from './base.entity';
export declare abstract class BaseService<T extends BaseEntity> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    findById(id: string): Promise<T>;
    findAll(): Promise<T[]>;
    create(createDto: DeepPartial<T>): Promise<T>;
    update(id: string, updateDto: DeepPartial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    protected abstract getEntityName(): string;
    protected excludeFields<K extends keyof T>(entity: T, fields: K[]): Omit<T, K>;
}
