import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RegistrationQuestionService, CreateRegistrationQuestionDto, UpdateRegistrationQuestionDto } from '../services/registration-question.service';

@Controller('events/:eventId/registration-questions')
export class RegistrationQuestionController {
  constructor(private readonly questionService: RegistrationQuestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addQuestion(@Request() req, @Param('eventId') eventId: string, @Body() createDto: CreateRegistrationQuestionDto) {
    const question = await this.questionService.addQuestion(req.user.userId, eventId, createDto);
    return { message: 'Registration question added successfully', question };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getQuestions(@Request() req, @Param('eventId') eventId: string) {
    const questions = await this.questionService.getEventQuestions(req.user.userId, eventId);
    return { message: 'Registration questions retrieved successfully', questions, total: questions.length };
  }

  @Put(':questionId')
  @UseGuards(JwtAuthGuard)
  async updateQuestion(@Request() req, @Param('eventId') eventId: string, @Param('questionId') questionId: string, @Body() updateDto: UpdateRegistrationQuestionDto) {
    const question = await this.questionService.updateQuestion(req.user.userId, eventId, questionId, updateDto);
    return { message: 'Registration question updated successfully', question };
  }

  @Delete(':questionId')
  @UseGuards(JwtAuthGuard)
  async deleteQuestion(@Request() req, @Param('eventId') eventId: string, @Param('questionId') questionId: string) {
    await this.questionService.deleteQuestion(req.user.userId, eventId, questionId);
    return { message: 'Registration question deleted successfully' };
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  async reorderQuestions(@Request() req, @Param('eventId') eventId: string, @Body('questions') questions: { id: string; displayOrder: number }[]) {
    await this.questionService.reorderQuestions(req.user.userId, eventId, questions);
    return { message: 'Registration questions reordered successfully' };
  }
}
