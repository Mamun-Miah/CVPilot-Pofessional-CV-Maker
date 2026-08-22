import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateCommentStatusDto } from './dto/update-comment-status.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({
    summary: 'Get admin panel platform overview stats & system health',
    description:
      'Returns overall platform stats (Total Users, Resumes, Downloads, Revenue) and real-time System Health metrics (CPU, Memory, Database, Bandwidth, Uptime, Avg Response).',
  })
  @ApiResponse({
    status: 200,
    description: 'Overview statistics returned successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have Admin or Superadmin role.',
  })
  async getOverviewStats() {
    const result = await this.adminService.getOverviewStats();
    return result;
  }

  @Get('users')
  @ApiOperation({
    summary: 'Get all platform users',
    description:
      'Fetches recent platform users with role, status, verification state, and resume count.',
  })
  @ApiQuery({ name: 'search', required: false, example: 'Tania' })
  @ApiResponse({
    status: 200,
    description: 'User list returned successfully.',
  })
  async getUsers(@Query('search') search?: string) {
    const result = await this.adminService.getUsers(search);
    return result;
  }

  @Patch('users/:id/status')
  @ApiOperation({
    summary: 'Update user status or role',
    description:
      'Allows admin to suspend/activate a user or change user roles (user, admin, superadmin).',
  })
  @ApiParam({ name: 'id', example: 'u-12345' })
  @ApiBody({ type: UpdateUserStatusDto })
  @ApiResponse({
    status: 200,
    description: 'User status/role updated successfully.',
  })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    const result = await this.adminService.updateUserStatus(id, dto);
    return result;
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user account',
    description: 'Permanently removes a user account from the system.',
  })
  @ApiParam({ name: 'id', example: 'u-12345' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  async deleteUser(@Param('id') id: string) {
    const result = await this.adminService.deleteUser(id);
    return result;
  }

  @Get('audit-logs')
  @ApiOperation({
    summary: 'Get system audit logs',
    description:
      'Fetches system audit logs (User Login, Resume Created, AI Chat Used, Failed Login Attempt, QR Code Generated, PDF Download).',
  })
  @ApiResponse({
    status: 200,
    description: 'Audit logs returned successfully.',
  })
  async getAuditLogs() {
    const result = await this.adminService.getAuditLogs();
    return result;
  }

  @Get('comments')
  @ApiOperation({
    summary: 'Get comments for admin moderation',
    description:
      'Fetches all user comments posted on public resumes for moderation review.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    example: 'flagged',
    description: 'Filter status (all / approved / flagged / hidden)',
  })
  @ApiQuery({ name: 'search', required: false, example: 'spam' })
  @ApiResponse({
    status: 200,
    description: 'Comment moderation list returned successfully.',
  })
  async getComments(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.adminService.getComments(status, search);
    return result;
  }

  @Patch('comments/:commentId/status')
  @ApiOperation({
    summary: 'Moderate comment status',
    description:
      'Updates comment moderation status to approved, flagged, or hidden.',
  })
  @ApiParam({ name: 'commentId', example: 'comment-12345' })
  @ApiBody({ type: UpdateCommentStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Comment status updated successfully.',
  })
  async updateCommentStatus(
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentStatusDto,
  ) {
    const result = await this.adminService.updateCommentStatus(
      commentId,
      dto.status,
    );
    return result;
  }

  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete comment as Admin',
    description: 'Allows Admin to permanently remove an inappropriate comment.',
  })
  @ApiParam({ name: 'commentId', example: 'comment-12345' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully by admin.',
  })
  async deleteComment(@Param('commentId') commentId: string) {
    const result = await this.adminService.deleteComment(commentId);
    return result;
  }
}
