import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRegistrationQuestion, QuestionType } from '../entities/event-registration-question.entity';
import { Event } from '../entities/event.entity';

export class CreateRegistrationQuestionDto {
  question: string;
  description?: string;
  type: QuestionType;
  isRequired?: boolean;
  displayOrder?: number;
  options?: string[];
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  validationPattern?: string;
  validationMessage?: string;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  placeholderText?: string;
  helpText?: string;
}

export class UpdateRegistrationQuestionDto {
  question?: string;
  description?: string;
  isRequired?: boolean;
  displayOrder?: number;
  options?: string[];
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  validationPattern?: string;
  validationMessage?: string;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  placeholderText?: string;
  helpText?: string;
  isActive?: boolean;
}

@Injectable()
export class RegistrationQuestionService {
  constructor(
    @InjectRepository(EventRegistrationQuestion)
    private questionRepository: Repository<EventRegistrationQuestion>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async addQuestion(userId: string, eventId: string, createDto: CreateRegistrationQuestionDto): Promise<EventRegistrationQuestion> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    // Get next display order
    const lastQuestion = await this.questionRepository.findOne({
      where: { eventId },
      order: { displayOrder: 'DESC' }
    });

    const displayOrder = createDto.displayOrder || ((lastQuestion?.displayOrder || 0) + 1);

    const question = this.questionRepository.create({
      ...createDto,
      eventId,
      displayOrder
    });

    return this.questionRepository.save(question) as unknown as EventRegistrationQuestion;
  }

  async getEventQuestions(userId: string, eventId: string): Promise<EventRegistrationQuestion[]> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    return this.questionRepository.find({
      where: { eventId },
      order: { displayOrder: 'ASC' }
    });
  }

  async updateQuestion(userId: string, eventId: string, questionId: string, updateDto: UpdateRegistrationQuestionDto): Promise<EventRegistrationQuestion> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const question = await this.questionRepository.findOne({
      where: { id: questionId, eventId }
    });

    if (!question) {
      throw new NotFoundException('Registration question not found');
    }

    Object.assign(question, updateDto);
    return this.questionRepository.save(question) as unknown as EventRegistrationQuestion;
  }

  async deleteQuestion(userId: string, eventId: string, questionId: string): Promise<void> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const question = await this.questionRepository.findOne({
      where: { id: questionId, eventId }
    });

    if (!question) {
      throw new NotFoundException('Registration question not found');
    }

    await this.questionRepository.remove(question);
  }

  async reorderQuestions(userId: string, eventId: string, questionOrders: { id: string; displayOrder: number }[]): Promise<void> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    for (const order of questionOrders) {
      await this.questionRepository.update(
        { id: order.id, eventId },
        { displayOrder: order.displayOrder }
      );
    }
  }
}
