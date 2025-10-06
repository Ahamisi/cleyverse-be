import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventHost, HostRole, HostPermissions } from '../entities/event-host.entity';
import { Event, EventStatus } from '../entities/event.entity';
import { AddHostDto, UpdateHostDto, AcceptHostInvitationDto } from '../dto/host.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HostService {
  constructor(
    @InjectRepository(EventHost)
    private hostRepository: Repository<EventHost>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async addHost(userId: string, eventId: string, addHostDto: AddHostDto): Promise<EventHost> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    // Check if host already exists
    const existingHost = await this.hostRepository.findOne({
      where: { eventId, user: { email: addHostDto.email } },
      relations: ['user']
    });

    if (existingHost) {
      throw new ConflictException('User is already a host for this event');
    }

    // TODO: Find user by email or create invitation
    // For now, we'll create an invitation that needs to be accepted
    const host = this.hostRepository.create({
      eventId,
      userId: null, // Will be set when invitation is accepted
      role: addHostDto.role,
      permissions: addHostDto.permissions,
      title: addHostDto.title,
      bio: addHostDto.bio,
      company: addHostDto.company,
      profileImageUrl: addHostDto.profileImageUrl,
      linkedinUrl: addHostDto.linkedinUrl,
      twitterUrl: addHostDto.twitterUrl,
      isFeatured: addHostDto.isFeatured || false,
      invitedBy: userId,
      invitedAt: new Date(),
      invitationToken: uuidv4(),
      isActive: false // Will be activated when invitation is accepted
    });

    return this.hostRepository.save(host) as unknown as EventHost;
  }

  async getEventHosts(userId: string, eventId: string): Promise<EventHost[]> {
    // Verify event belongs to user or user is a host
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    const isHost = await this.hostRepository.findOne({
      where: { eventId, userId, isActive: true }
    });

    if (!event && !isHost) {
      throw new NotFoundException('Event not found or access denied');
    }

    return this.hostRepository.find({
      where: { eventId },
      relations: ['user'],
      order: { 
        isFeatured: 'DESC',
        displayOrder: 'ASC',
        createdAt: 'ASC'
      }
    });
  }

  async updateHost(userId: string, eventId: string, hostId: string, updateHostDto: UpdateHostDto): Promise<EventHost> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const host = await this.hostRepository.findOne({
      where: { id: hostId, eventId }
    });

    if (!host) {
      throw new NotFoundException('Host not found');
    }

    // Prevent owner from changing their own role
    if (host.userId === userId && updateHostDto.role && updateHostDto.role !== HostRole.OWNER) {
      throw new BadRequestException('Event owner cannot change their own role');
    }

    Object.assign(host, updateHostDto);
    return this.hostRepository.save(host) as unknown as EventHost;
  }

  async removeHost(userId: string, eventId: string, hostId: string): Promise<void> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const host = await this.hostRepository.findOne({
      where: { id: hostId, eventId }
    });

    if (!host) {
      throw new NotFoundException('Host not found');
    }

    // Prevent owner from removing themselves
    if (host.userId === userId && host.role === HostRole.OWNER) {
      throw new BadRequestException('Event owner cannot remove themselves');
    }

    await this.hostRepository.remove(host);
  }

  async acceptHostInvitation(acceptDto: AcceptHostInvitationDto): Promise<EventHost> {
    const host = await this.hostRepository.findOne({
      where: { invitationToken: acceptDto.invitationToken },
      relations: ['event']
    });

    if (!host) {
      throw new NotFoundException('Invalid invitation token');
    }

    if (host.acceptedAt) {
      throw new BadRequestException('Invitation has already been accepted');
    }

    // TODO: Get user ID from authentication context
    // For now, we'll assume the user ID is available
    // host.userId = currentUserId;
    
    host.acceptedAt = new Date();
    host.isActive = true;
    host.invitationToken = null;

    // Update host information
    if (acceptDto.title) host.title = acceptDto.title;
    if (acceptDto.bio) host.bio = acceptDto.bio;
    if (acceptDto.company) host.company = acceptDto.company;
    if (acceptDto.profileImageUrl) host.profileImageUrl = acceptDto.profileImageUrl;
    if (acceptDto.linkedinUrl) host.linkedinUrl = acceptDto.linkedinUrl;
    if (acceptDto.twitterUrl) host.twitterUrl = acceptDto.twitterUrl;

    return this.hostRepository.save(host) as unknown as EventHost;
  }

  async getHostInvitation(token: string): Promise<EventHost> {
    const host = await this.hostRepository.findOne({
      where: { invitationToken: token },
      relations: ['event']
    });

    if (!host) {
      throw new NotFoundException('Invalid invitation token');
    }

    if (host.acceptedAt) {
      throw new BadRequestException('Invitation has already been accepted');
    }

    return host;
  }

  async generateHostLoginToken(userId: string, eventId: string, callbackUrl?: string): Promise<{ token: string; loginUrl: string }> {
    // Verify user is a host for this event
    const host = await this.hostRepository.findOne({
      where: { eventId, userId, isActive: true }
    });

    if (!host) {
      throw new NotFoundException('You are not a host for this event');
    }

    // Generate a temporary login token for event day access
    const loginToken = uuidv4();
    
    // TODO: Store this token in Redis with expiration (e.g., 24 hours)
    // For now, we'll just return the token
    
    const baseUrl = callbackUrl || `https://app.cleyverse.com/events/${eventId}/host-dashboard`;
    const loginUrl = `${baseUrl}?token=${loginToken}`;

    return { token: loginToken, loginUrl };
  }

  async generateBulkHostLoginTokens(userId: string, eventId: string, callbackUrl?: string): Promise<{ hosts: any[]; tokens: any[] }> {
    // Verify user is the event owner
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or you are not the owner');
    }

    // Get all active hosts for this event
    const hosts = await this.hostRepository.find({
      where: { eventId, isActive: true },
      relations: ['user']
    });

    const tokens: any[] = [];
    
    for (const host of hosts) {
      if (host.userId) {
        const loginToken = uuidv4();
        const baseUrl = callbackUrl || `https://app.cleyverse.com/events/${eventId}/host-dashboard`;
        const loginUrl = `${baseUrl}?token=${loginToken}`;

        tokens.push({
          hostId: host.id,
          userId: host.userId,
          email: host.user?.email,
          name: host.user?.firstName + ' ' + host.user?.lastName,
          role: host.role,
          token: loginToken,
          loginUrl
        });
      }
    }

    return { hosts, tokens };
  }

  async verifyHostAccess(userId: string, eventId: string, requiredPermission: HostPermissions): Promise<boolean> {
    const host = await this.hostRepository.findOne({
      where: { eventId, userId, isActive: true }
    });

    if (!host) {
      return false;
    }

    // Event owner has all permissions
    if (host.role === HostRole.OWNER) {
      return true;
    }

    // Check if host has the required permission
    return host.permissions.includes(requiredPermission);
  }

  async getPublicEventHosts(eventId: string): Promise<EventHost[]> {
    return this.hostRepository.find({
      where: { 
        eventId,
        isActive: true,
        isFeatured: true
      },
      relations: ['user'],
      order: { 
        displayOrder: 'ASC',
        createdAt: 'ASC'
      }
    });
  }
}
