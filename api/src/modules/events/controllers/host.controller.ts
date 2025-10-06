import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { HostService } from '../services/host.service';
import { AddHostDto, UpdateHostDto, AcceptHostInvitationDto } from '../dto/host.dto';

@Controller('events/:eventId/hosts')
export class HostController {
  constructor(private readonly hostService: HostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addHost(@Request() req, @Param('eventId') eventId: string, @Body() addHostDto: AddHostDto) {
    const host = await this.hostService.addHost(req.user.userId, eventId, addHostDto);
    return { 
      message: 'Host invitation sent successfully', 
      host,
      invitationUrl: `https://cley.live/host-invitation/${host.invitationToken}`
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Param('eventId') eventId: string) {
    const hosts = await this.hostService.getEventHosts(req.user.userId, eventId);
    return { message: 'Hosts retrieved successfully', hosts, total: hosts.length };
  }

  @Get('public')
  async getPublicHosts(@Param('eventId') eventId: string) {
    const hosts = await this.hostService.getPublicEventHosts(eventId);
    return { message: 'Public hosts retrieved successfully', hosts, total: hosts.length };
  }

  @Put(':hostId')
  @UseGuards(JwtAuthGuard)
  async updateHost(@Request() req, @Param('eventId') eventId: string, @Param('hostId') hostId: string, @Body() updateHostDto: UpdateHostDto) {
    const host = await this.hostService.updateHost(req.user.userId, eventId, hostId, updateHostDto);
    return { message: 'Host updated successfully', host };
  }

  @Delete(':hostId')
  @UseGuards(JwtAuthGuard)
  async removeHost(@Request() req, @Param('eventId') eventId: string, @Param('hostId') hostId: string) {
    await this.hostService.removeHost(req.user.userId, eventId, hostId);
    return { message: 'Host removed successfully' };
  }

  @Post('generate-login-token')
  @UseGuards(JwtAuthGuard)
  async generateLoginToken(@Request() req, @Param('eventId') eventId: string, @Body() body?: { callbackUrl?: string }) {
    const result = await this.hostService.generateHostLoginToken(req.user.userId, eventId, body?.callbackUrl);
    return { 
      message: 'Host login token generated successfully', 
      token: result.token,
      loginUrl: result.loginUrl,
      expiresIn: '24 hours'
    };
  }

  @Post('generate-bulk-tokens')
  @UseGuards(JwtAuthGuard)
  async generateBulkTokens(@Request() req, @Param('eventId') eventId: string, @Body() body?: { callbackUrl?: string }) {
    const result = await this.hostService.generateBulkHostLoginTokens(req.user.userId, eventId, body?.callbackUrl);
    return { 
      message: 'Bulk host login tokens generated successfully', 
      hosts: result.hosts.length,
      tokens: result.tokens,
      expiresIn: '24 hours'
    };
  }
}

@Controller('host-invitations')
export class HostInvitationController {
  constructor(private readonly hostService: HostService) {}

  @Get(':token')
  async getInvitation(@Param('token') token: string) {
    const host = await this.hostService.getHostInvitation(token);
    return { 
      message: 'Host invitation retrieved successfully', 
      invitation: {
        id: host.id,
        role: host.role,
        permissions: host.permissions,
        event: {
          id: host.event.id,
          title: host.event.title,
          startDate: host.event.startDate,
          endDate: host.event.endDate
        },
        invitedAt: host.invitedAt
      }
    };
  }

  @Post(':token/accept')
  @UseGuards(JwtAuthGuard)
  async acceptInvitation(@Param('token') token: string, @Body() acceptDto: AcceptHostInvitationDto) {
    const host = await this.hostService.acceptHostInvitation({ ...acceptDto, invitationToken: token });
    return { message: 'Host invitation accepted successfully', host };
  }
}
