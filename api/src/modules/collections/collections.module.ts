import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Link } from '../links/entities/link.entity';
import { User } from '../users/entities/user.entity';
import { CollectionService } from './services/collection.service';
import { CollectionsController } from './controllers/collections.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, Link, User]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionsModule {}
