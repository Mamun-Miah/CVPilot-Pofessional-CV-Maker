import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { RateResumeDto } from './dto/rate-resume.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { ToggleShareDto } from './dto/toggle-share.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

const FULL_RESUME_EXAMPLE = {
  title: 'My Professional Resume',
  template: 'modern-professional',
  personalInfo: {
    fullName: 'Rahim Ahmed',
    jobTitle: 'Senior Software Engineer',
    email: 'rahim.ahmed@example.com',
    phone: '+880 1711 234567',
    location: 'Dhaka, Bangladesh',
    website: 'https://rahimahmed.dev',
    linkedin: 'linkedin.com/in/rahimahmed',
    github: 'github.com/rahimahmed',
    avatar: 'https://example.com/avatar.jpg',
  },
  summary:
    'Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture.',
  objective:
    'Seeking a challenging Senior Software Engineer position at a forward-thinking company where I can leverage my expertise in full-stack development, system design, and team leadership to drive innovation and deliver exceptional user experiences.',
  experiences: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'Brain Station 23',
      location: 'Dhaka, Bangladesh',
      startDate: 'Jun 2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Architected microservices migration reducing deployment time by 70%',
        'Led adoption of TypeScript across 12+ repositories improving code quality',
        'Mentored 6 junior engineers, with 3 promoted to mid-level within a year',
      ],
      description:
        'Led backend & frontend architectural improvements for enterprise clients.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Sc. in Computer Science and Engineering',
      institution: 'Bangladesh University of Engineering and Technology',
      location: 'Dhaka, Bangladesh',
      startDate: '2015',
      endDate: '2019',
      cgpa: '3.78/4.00',
    },
  ],
  skills: [
    {
      id: 'skill-1',
      name: 'JavaScript/TypeScript',
      level: 100,
      category: 'Programming Languages',
    },
    {
      id: 'skill-2',
      name: 'React.js',
      level: 100,
      category: 'Frontend',
    },
    {
      id: 'skill-3',
      name: 'Node.js',
      level: 90,
      category: 'Backend',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'CareerPilot BD',
      link: 'careerpilot.com.bd',
      description: 'AI-powered resume builder for the Bangladesh job market',
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'AWS Solutions Architect Associate',
      issuer: 'Amazon Web Services',
      date: 'Aug 2023',
      link: 'https://aws.amazon.com/verification',
    },
  ],
  languages: [
    {
      id: 'lang-1',
      language: 'Bengali',
      proficiency: 'native',
    },
    {
      id: 'lang-2',
      language: 'English',
      proficiency: 'fluent',
    },
  ],
  awards: [
    {
      id: 'award-1',
      title: 'Employee of the Year',
      issuer: 'Brain Station 23',
      date: '2023',
      description: 'Awarded for exceptional technical leadership.',
    },
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Tanvir Hasan',
      relationship: 'Former Team Lead',
      company: 'ShopUp',
      contact: 'tanvir@example.com',
    },
  ],
  bdDetails: {
    fatherName: 'Mohammed Karim',
    motherName: 'Fatima Begum',
    dob: '1995-05-15',
    gender: 'Male',
    religion: 'Islam',
    maritalStatus: 'Single',
    nationality: 'Bangladeshi',
    nidNumber: '1995123456789',
    passportNo: 'A12345678',
    drivingLicense: 'DL123456',
    expectedSalary: '৳80,000 - ৳1,20,000',
    preferredLocation: 'Dhaka, Chittagong',
  },
  interests: ['Open Source', 'Chess', 'Cricket', 'Reading', 'Travel'],
  design: {
    primaryColor: '#0f766e',
    fontFamily: 'Inter',
    template: 'modern-professional',
  },
};

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new resume',
    description:
      'Creates a new CV document with personal info, work experience, education, skills, projects, certifications, languages, awards, references, BD details, interests, and custom design options.',
  })
  @ApiBody({
    type: CreateResumeDto,
    examples: {
      default: {
        summary: 'Full Resume Example',
        value: FULL_RESUME_EXAMPLE,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Resume successfully created with generated ATS score.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Bearer token.',
  })
  create(
    @GetUser('id') userId: string,
    @Body() createResumeDto: CreateResumeDto,
  ) {
    return this.resumesService.create(userId, createResumeDto);
  }

  @Get('templates')
  @ApiOperation({
    summary: 'Get list of available CV templates',
    description:
      'Returns all available resume template designs with category filters, ATS scores, tags, and color palettes.',
  })
  @ApiQuery({ name: 'category', required: false, example: 'modern' })
  @ApiQuery({ name: 'search', required: false, example: 'ATS' })
  @ApiResponse({
    status: 200,
    description: 'Template gallery list returned successfully.',
  })
  getTemplates(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.resumesService.getTemplates(category, search);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all resumes for authenticated user',
    description:
      'Returns list of all resumes belonging to logged in user ordered by last update.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of resumes returned successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  findAll(@GetUser('id') userId: string) {
    return this.resumesService.findAllForUser(userId);
  }

  @Get('public/showcase')
  @ApiOperation({
    summary: 'Get public resume showcase gallery feed',
    description:
      'Public feed displaying shared resumes on the platform with rating scores, comment counts, and author details.',
  })
  @ApiQuery({ name: 'search', required: false, example: 'Engineer' })
  @ApiQuery({
    name: 'sort',
    required: false,
    example: 'popular',
    description: 'Sort order (recent / popular / top-rated)',
  })
  @ApiResponse({
    status: 200,
    description: 'Showcase resumes returned successfully.',
  })
  async getPublicShowcase(
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return await this.resumesService.getPublicShowcase(search, sort);
  }

  @Get('public/:slug')
  @ApiOperation({
    summary: 'Get public resume by slug',
    description:
      'Public endpoint to view a shared resume preview by its unique slug URL.',
  })
  @ApiParam({
    name: 'slug',
    example: 'rahim-ahmed-dev',
    description: 'Unique public slug',
  })
  @ApiResponse({
    status: 200,
    description: 'Public resume details returned successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found or is set to private.',
  })
  findPublic(@Param('slug') slug: string) {
    return this.resumesService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get a specific resume by ID',
    description: 'Fetches full resume data by resume ID for the owner user.',
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiResponse({
    status: 200,
    description: 'Resume record returned.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found or unauthorized.',
  })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.resumesService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update or autosave a resume',
    description:
      'Partial update endpoint used for editor autosaving. Recalculates ATS score automatically unless explicitly passed.',
  })
  @ApiBody({
    type: UpdateResumeDto,
    examples: {
      default: {
        summary: 'Full Resume Update Example',
        value: FULL_RESUME_EXAMPLE,
      },
    },
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiResponse({
    status: 200,
    description: 'Resume updated successfully.',
  })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumesService.update(id, userId, updateResumeDto);
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Duplicate an existing resume',
    description: 'Creates a exact duplicate copy of an existing resume.',
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiResponse({
    status: 201,
    description: 'Duplicated resume created.',
  })
  duplicate(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.resumesService.duplicate(id, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a resume',
    description: 'Permanently removes a resume record.',
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiResponse({
    status: 204,
    description: 'Resume deleted successfully.',
  })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.resumesService.remove(id, userId);
  }

  @Post(':id/share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Turn public link sharing ON / OFF and get shareable URL',
    description:
      'Toggles public access ON/OFF for a resume, generates unique URL slug, and returns the shareable URL and QR code for copying.',
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiBody({ type: ToggleShareDto, required: false })
  @ApiResponse({
    status: 200,
    description:
      'Returns updated public state, shareable URL, slug, and QR code.',
  })
  async shareResume(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() body?: ToggleShareDto,
  ) {
    const result = await this.resumesService.shareResume(
      id,
      userId,
      body?.isPublic,
    );
    return result;
  }

  @Get(':id/qr-code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get QR code for a resume',
    description:
      'Generates a high-resolution QR code Data URL for scanning and viewing the resume on mobile devices.',
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiResponse({
    status: 200,
    description: 'Returns QR code Data URL.',
  })
  async getQrCode(@Param('id') id: string, @GetUser('id') userId: string) {
    const result = await this.resumesService.getQrCode(id, userId);
    return result;
  }

  @Post(':id/download')
  @ApiOperation({
    summary: 'Track a resume download event',
    description: 'Increments the download counter for the specified resume.',
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiResponse({
    status: 200,
    description: 'Download count incremented.',
  })
  async trackDownload(@Param('id') id: string) {
    return await this.resumesService.trackDownload(id);
  }

  @Post(':id/ratings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Submit or update 1-5 star rating for a public resume',
    description:
      'Allows registered users to rate a public resume from 1 to 5 stars. Replaces previous rating if user already rated.',
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiBody({ type: RateResumeDto })
  @ApiResponse({
    status: 200,
    description: 'Rating submitted successfully with updated average rating.',
  })
  async rateResume(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: RateResumeDto,
  ) {
    return await this.resumesService.rateResume(id, userId, dto.rating);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Post a comment on a public resume',
    description:
      'Allows authenticated users to post feedback or comments on a public resume.',
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiBody({ type: AddCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully.',
  })
  async addComment(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: AddCommentDto,
  ) {
    return await this.resumesService.addComment(id, userId, dto.content);
  }

  @Get(':id/comments')
  @ApiOperation({
    summary: 'Get comments for a public resume',
    description: 'Lists all approved public comments for a given resume.',
  })
  @ApiParam({ name: 'id', example: 'd9b2e8a1-4c6e-4f5a-9a1b-2c3d4e5f6a7b' })
  @ApiResponse({
    status: 200,
    description: 'Comments list returned successfully.',
  })
  async getComments(@Param('id') id: string) {
    return await this.resumesService.getCommentsForResume(id);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete user own comment',
    description: 'Allows comment author to delete their posted comment.',
  })
  @ApiParam({ name: 'commentId', example: 'comment-12345' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully.',
  })
  async deleteComment(
    @Param('commentId') commentId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.resumesService.deleteComment(commentId, userId);
  }
}
