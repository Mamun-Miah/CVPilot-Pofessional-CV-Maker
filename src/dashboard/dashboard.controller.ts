import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user dashboard career statistics',
    description:
      'Fetches total resumes created, monthly resume additions, download counts, weekly changes, profile strength percentage, and recent resumes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard stats returned successfully.',
    schema: {
      example: {
        user: {
          name: 'Rahim Ahmed',
          email: 'rahim.ahmed@example.com',
          avatar: 'https://example.com/avatar.jpg',
          welcomeMessage: 'Welcome back, Rahim 👋',
        },
        myResumes: {
          total: 3,
          createdThisMonth: 2,
          changeLabel: '+2 this month',
        },
        downloads: {
          total: 47,
          thisWeek: 12,
          changeLabel: '+12 this week',
        },
        profileStrength: {
          percentage: 85,
          percentageLabel: '85%',
          status: 'Great profile strength',
        },
        recentResumes: [
          {
            id: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b',
            title: 'My Professional Resume',
            template: 'modern-professional',
            atsScore: 100,
            isPublic: false,
            slug: null,
            downloadsCount: 25,
            viewsCount: 110,
            updatedAt: '2026-08-22T13:30:00.000Z',
            createdAt: '2026-08-22T13:30:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid JWT token.',
  })
  getStats(@GetUser('id') userId: string) {
    return this.dashboardService.getDashboardStats(userId);
  }
}
