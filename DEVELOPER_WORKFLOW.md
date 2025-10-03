# 🚀 Cleyverse Developer Workflow & Conventions

## 📁 **Project Structure**

```
api/src/
├── common/                     # Shared utilities and base classes
│   ├── base/                   # Base entities and services
│   ├── decorators/             # Custom decorators
│   ├── interfaces/             # Common interfaces
│   └── guards/                 # Authentication guards
├── modules/                    # Feature modules
│   ├── users/                  # User management module
│   │   ├── entities/           # Database entities
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── services/           # Business logic
│   │   ├── controllers/        # HTTP controllers
│   │   └── users.module.ts     # Module definition
│   ├── auth/                   # Authentication module
│   └── [feature]/              # Other feature modules
├── shared/                     # Shared services
│   └── services/               # Cross-module services
├── database/                   # Database related files
│   └── migrations/             # TypeORM migrations
└── config/                     # Configuration files
```

## 🎯 **Naming Conventions**

### Files & Directories
- **Entities**: `user.entity.ts`, `email-verification.entity.ts`
- **Services**: `user.service.ts`, `email-verification.service.ts`
- **Controllers**: `users.controller.ts`, `auth.controller.ts`
- **DTOs**: `create-user.dto.ts`, `update-user.dto.ts`
- **Modules**: `users.module.ts`, `auth.module.ts`
- **Migrations**: `1695123456789-CreateUsersTable.ts`

### Database
- **Tables**: `users`, `email_verifications`, `user_links`
- **Columns**: `snake_case` - `first_name`, `created_at`, `is_active`
- **Indexes**: `idx_users_email`, `idx_users_username`

### Code
- **Classes**: `PascalCase` - `UserService`, `EmailVerification`
- **Methods**: `camelCase` - `findById`, `updateProfile`
- **Variables**: `camelCase` - `userId`, `emailToken`
- **Constants**: `UPPER_SNAKE_CASE` - `JWT_SECRET`, `MAX_LOGIN_ATTEMPTS`
- **Enums**: `PascalCase` values `UPPER_SNAKE_CASE` - `UserRole.ADMIN`

## 🔧 **Adding a New Feature Module**

### Step 1: Create Module Structure
```bash
mkdir -p src/modules/[feature-name]/{entities,dto,services,controllers}
```

### Step 2: Create Base Files
```typescript
// 1. Entity (src/modules/[feature]/entities/[feature].entity.ts)
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';

@Entity('[feature_table_name]')
export class FeatureName extends BaseEntity {
  @Column()
  name: string;
}

// 2. DTO (src/modules/[feature]/dto/create-[feature].dto.ts)
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

// 3. Service (src/modules/[feature]/services/[feature].service.ts)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { FeatureName } from '../entities/[feature].entity';

@Injectable()
export class FeatureService extends BaseService<FeatureName> {
  constructor(
    @InjectRepository(FeatureName)
    private readonly featureRepository: Repository<FeatureName>,
  ) {
    super(featureRepository);
  }

  protected getEntityName(): string {
    return 'FeatureName';
  }
}

// 4. Controller (src/modules/[feature]/controllers/[feature].controller.ts)
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FeatureService } from '../services/[feature].service';
import { CreateFeatureDto } from '../dto/create-[feature].dto';

@Controller('[feature-name]')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDto: CreateFeatureDto) {
    return this.featureService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.featureService.findById(id);
  }
}

// 5. Module (src/modules/[feature]/[feature].module.ts)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureName } from './entities/[feature].entity';
import { FeatureService } from './services/[feature].service';
import { FeatureController } from './controllers/[feature].controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureName])],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

### Step 3: Create Migration
```bash
npm run migration:generate -- src/database/migrations/Create[Feature]Table
```

### Step 4: Update App Module
```typescript
// Add to app.module.ts imports
import { FeatureModule } from './modules/[feature]/[feature].module';

@Module({
  imports: [
    // ... other imports
    FeatureModule,
  ],
})
```

## 🗄️ **Database Migrations**

### Commands
```bash
# Generate migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Migration Template
```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1695123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

## 🔐 **Authentication Pattern**

### Protected Endpoints
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return this.userService.findById(req.user.userId);
}
```

### Public Endpoints
```typescript
@Get('categories')
async getCategories() {
  return this.userService.getCategories();
}
```

## 📝 **DTO Validation Pattern**

```typescript
import { IsString, IsEmail, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsEnum(UserCategory)
  category?: UserCategory;
}
```

## 🧪 **Testing Pattern**

```typescript
// [feature].service.spec.ts
describe('FeatureService', () => {
  let service: FeatureService;
  let repository: Repository<FeatureName>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FeatureService,
        {
          provide: getRepositoryToken(FeatureName),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    repository = module.get<Repository<FeatureName>>(getRepositoryToken(FeatureName));
  });

  it('should create feature', async () => {
    // Test implementation
  });
});
```

## 🚀 **Development Commands**

```bash
# Start development server
npm run start:dev

# Run migrations
npm run migration:run

# Generate migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format
```

## ✅ **Code Quality Checklist**

- [ ] Follow naming conventions
- [ ] Use proper TypeScript types
- [ ] Add validation to DTOs
- [ ] Extend BaseService for CRUD operations
- [ ] Use proper HTTP status codes
- [ ] Add authentication guards where needed
- [ ] Write unit tests
- [ ] Create migration for database changes
- [ ] Update module imports
- [ ] Document API endpoints

## 🎯 **DRY Principles Applied**

1. **BaseEntity** - Common fields (id, createdAt, updatedAt)
2. **BaseService** - Common CRUD operations
3. **Common interfaces** - Standardized API responses
4. **Shared decorators** - Reusable validation and metadata
5. **Module pattern** - Consistent feature organization

---

**Remember**: Every new feature should follow this exact pattern. No exceptions!
