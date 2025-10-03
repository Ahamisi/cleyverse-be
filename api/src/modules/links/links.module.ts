import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { SocialLink } from './entities/social-link.entity';
import { User } from '../users/entities/user.entity';
import { LinkService, SocialLinkService } from './services';
import { LinksController } from './controllers/links.controller';
import { SocialLinksController } from './controllers/social-links.controller';
import { MediaProcessorService } from '../../shared/services/media-processor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Link, SocialLink, User]),
  ],
  controllers: [LinksController, SocialLinksController],
  providers: [LinkService, SocialLinkService, MediaProcessorService],
  exports: [LinkService, SocialLinkService],
})
export class LinksModule {}
