import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import {
  PersonalInfoDto,
  ExperienceItemDto,
  EducationItemDto,
  SkillItemDto,
  ProjectItemDto,
  CertificationItemDto,
  LanguageItemDto,
  BdDetailsDto,
} from './dto/resume-content.dto';
import { Prisma, Resume } from '@prisma/client';
import * as QRCode from 'qrcode';

export interface ShareResumeResult {
  id: string;
  title: string;
  isPublic: boolean;
  slug: string | null;
  shareUrl: string;
  qrCode: string;
}

export interface QrCodeResult {
  id: string;
  title: string;
  isPublic: boolean;
  targetUrl: string;
  qrCode: string;
}

@Injectable()
export class ResumesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper function to calculate an ATS score out of 100 based on resume completeness.
   */
  private calculateAtsScore(
    dto: CreateResumeDto | UpdateResumeDto,
    existing?: Resume,
  ): number {
    const personalInfo = (
      dto.personalInfo !== undefined ? dto.personalInfo : existing?.personalInfo
    ) as PersonalInfoDto | null | undefined;

    const summary = dto.summary !== undefined ? dto.summary : existing?.summary;
    const objective =
      dto.objective !== undefined ? dto.objective : existing?.objective;

    const experiences = (
      dto.experiences !== undefined ? dto.experiences : existing?.experiences
    ) as ExperienceItemDto[] | null | undefined;

    const education = (
      dto.education !== undefined ? dto.education : existing?.education
    ) as EducationItemDto[] | null | undefined;

    const skills = (
      dto.skills !== undefined ? dto.skills : existing?.skills
    ) as SkillItemDto[] | null | undefined;

    const projects = (
      dto.projects !== undefined ? dto.projects : existing?.projects
    ) as ProjectItemDto[] | null | undefined;

    const certifications = (
      dto.certifications !== undefined
        ? dto.certifications
        : existing?.certifications
    ) as CertificationItemDto[] | null | undefined;

    const languages = (
      dto.languages !== undefined ? dto.languages : existing?.languages
    ) as LanguageItemDto[] | null | undefined;

    const bdDetails = (
      dto.bdDetails !== undefined ? dto.bdDetails : existing?.bdDetails
    ) as BdDetailsDto | null | undefined;

    let score = 0;

    // Personal Info (max 20)
    if (personalInfo) {
      if (personalInfo.fullName) score += 5;
      if (personalInfo.email) score += 5;
      if (personalInfo.phone) score += 5;
      if (personalInfo.location) score += 5;
    }

    // Summary / Objective (max 15)
    const summaryText: string | null | undefined = summary || objective;
    if (summaryText && summaryText.trim().length >= 30) {
      score += 15;
    } else if (summaryText && summaryText.trim().length > 0) {
      score += 5;
    }

    // Experience (max 25)
    if (Array.isArray(experiences) && experiences.length > 0) {
      score += 15;
      if (
        experiences.some(
          (exp: ExperienceItemDto) =>
            (exp.bullets && exp.bullets.length > 0) ||
            (exp.highlights && exp.highlights.length > 0) ||
            exp.description,
        )
      ) {
        score += 10;
      }
    }

    // Education (max 15)
    if (Array.isArray(education) && education.length > 0) {
      score += 15;
    }

    // Skills (max 15)
    if (Array.isArray(skills) && skills.length >= 3) {
      score += 15;
    } else if (Array.isArray(skills) && skills.length > 0) {
      score += 8;
    }

    // Bonus Sections (Certifications / Projects / Languages / BD Details - max 10)
    let bonus = 0;
    if (Array.isArray(projects) && projects.length > 0) bonus += 3;
    if (Array.isArray(certifications) && certifications.length > 0) bonus += 3;
    if (Array.isArray(languages) && languages.length > 0) bonus += 2;
    if (bdDetails && Object.keys(bdDetails).length > 0) bonus += 2;
    score += Math.min(10, bonus);

    return Math.min(100, score);
  }

  /**
   * Generates a URL-friendly unique slug for public sharing.
   */
  private generateSlug(title: string, name?: string): string {
    const base = (name || title || 'resume')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${base}-${randomSuffix}`;
  }

  /**
   * Helper to render QR Code Data URL from target link.
   */
  async generateQrCode(url: string): Promise<string> {
    return QRCode.toDataURL(url, {
      margin: 2,
      width: 300,
      color: {
        dark: '#0f766e', // Brand teal color
        light: '#ffffff',
      },
    });
  }

  async create(userId: string, createResumeDto: CreateResumeDto) {
    const atsScore = this.calculateAtsScore(createResumeDto);

    return this.prisma.resume.create({
      data: {
        userId,
        title: createResumeDto.title || 'My Professional Resume',
        template: createResumeDto.template || 'modern-professional',
        atsScore,
        personalInfo: createResumeDto.personalInfo
          ? (createResumeDto.personalInfo as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        summary: createResumeDto.summary || null,
        objective: createResumeDto.objective || null,
        experiences: createResumeDto.experiences
          ? (createResumeDto.experiences as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        education: createResumeDto.education
          ? (createResumeDto.education as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        skills: createResumeDto.skills
          ? (createResumeDto.skills as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        projects: createResumeDto.projects
          ? (createResumeDto.projects as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        certifications: createResumeDto.certifications
          ? (createResumeDto.certifications as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        languages: createResumeDto.languages
          ? (createResumeDto.languages as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        awards: createResumeDto.awards
          ? (createResumeDto.awards as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        references: createResumeDto.references
          ? (createResumeDto.references as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        bdDetails: createResumeDto.bdDetails
          ? (createResumeDto.bdDetails as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        interests: createResumeDto.interests
          ? (createResumeDto.interests as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        design: createResumeDto.design
          ? (createResumeDto.design as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  getTemplates(category?: string, search?: string) {
    const templates = [
      {
        id: 'modern-professional',
        name: 'Modern Professional',
        category: 'modern',
        isAtsFriendly: true,
        atsScore: 98,
        tags: ['modern', 'ATS Friendly'],
        colors: ['#0f766e', '#f59e0b'],
        description:
          'Clean split sidebar layout optimized for tech & corporate professionals.',
        fontFamily: 'Inter',
      },
      {
        id: 'ats-classic',
        name: 'ATS Classic',
        category: 'ats',
        isAtsFriendly: true,
        atsScore: 95,
        tags: ['ats', 'ATS Friendly'],
        colors: ['#1e293b', '#0ea5e9'],
        description:
          'Single column traditional layout guaranteed to pass all ATS scanners.',
        fontFamily: 'Arial',
      },
      {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        category: 'minimal',
        isAtsFriendly: true,
        atsScore: 92,
        tags: ['minimal', 'Minimal'],
        colors: ['#111827', '#6366f1'],
        description:
          'Ultra minimal typography layout with elegant spacing and subtle accents.',
        fontFamily: 'Helvetica',
      },
      {
        id: 'executive-bold',
        name: 'Executive Bold',
        category: 'executive',
        isAtsFriendly: true,
        atsScore: 89,
        tags: ['executive', 'Executive'],
        colors: ['#7c2d12', '#ca8a04'],
        description:
          'Strong header banner layout tailored for senior leadership and management.',
        fontFamily: 'Lato',
      },
      {
        id: 'creative-gradient',
        name: 'Creative Gradient',
        category: 'creative',
        isAtsFriendly: false,
        atsScore: 87,
        tags: ['creative', 'Creative'],
        colors: ['#7c3aed', '#f59e0b'],
        description:
          'Vibrant modern header gradient designed for UI/UX designers and marketers.',
        fontFamily: 'Open Sans',
      },
      {
        id: 'developer-tech',
        name: 'Developer Tech',
        category: 'developer',
        isAtsFriendly: true,
        atsScore: 91,
        tags: ['developer', 'Developer'],
        colors: ['#059669', '#84cc16'],
        description:
          'Tech-focused layout highlighting technical stack, GitHub links, and code projects.',
        fontFamily: 'Inter',
      },
      {
        id: 'corporate-standard',
        name: 'Corporate Standard',
        category: 'corporate',
        isAtsFriendly: true,
        atsScore: 94,
        tags: ['corporate', 'Corporate'],
        colors: ['#1e3a8a', '#6b7280'],
        description:
          'Formal corporate style suitable for banking, finance, and enterprise roles.',
        fontFamily: 'Calibri',
      },
      {
        id: 'bangladesh-standard',
        name: 'Bangladesh Standard',
        category: 'bd-standard',
        isAtsFriendly: true,
        atsScore: 96,
        tags: ['bd-standard', 'BD Standard'],
        colors: ['#006a4e', '#f42a41'],
        description:
          'Custom BD job market layout with full support for BD Personal Details (Father/Mother Name, NID, DOB).',
        fontFamily: 'Roboto',
      },
    ];

    return templates.filter((t) => {
      const matchCategory =
        !category || category === 'all' || t.category === category;
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }

  async trackDownload(id: string) {
    const resume = await this.prisma.resume.update({
      where: { id },
      data: {
        downloadsCount: { increment: 1 },
      },
    });
    return resume;
  }

  async findOne(id: string, userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }

    if (resume.userId !== userId) {
      throw new ForbiddenException('You do not have access to this resume');
    }

    return resume;
  }

  async findBySlug(slug: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!resume || !resume.isPublic) {
      throw new NotFoundException('Public resume not found or private');
    }

    // Increment views count asynchronously
    await this.prisma.resume.update({
      where: { id: resume.id },
      data: { viewsCount: { increment: 1 } },
    });

    return resume;
  }

  async shareResume(
    id: string,
    userId: string,
    isPublicState?: boolean,
    hostUrl?: string,
  ): Promise<ShareResumeResult> {
    const resume = await this.findOne(id, userId);

    const newIsPublic =
      isPublicState !== undefined ? isPublicState : !resume.isPublic;

    let slug = resume.slug;
    if (newIsPublic && !slug) {
      const personal = resume.personalInfo as PersonalInfoDto | null;
      slug = this.generateSlug(resume.title, personal?.fullName);
    }

    const updated = await this.prisma.resume.update({
      where: { id },
      data: {
        isPublic: newIsPublic,
        ...(slug && { slug }),
      },
    });

    const origin = hostUrl || 'https://careerpilot.com.bd';
    const shareUrl =
      newIsPublic && updated.slug ? `${origin}/r/${updated.slug}` : '';
    const qrCode = shareUrl ? await this.generateQrCode(shareUrl) : '';

    return {
      id: updated.id,
      title: updated.title,
      isPublic: updated.isPublic,
      slug: updated.slug,
      shareUrl,
      qrCode,
    };
  }

  async getQrCode(
    id: string,
    userId: string,
    hostUrl?: string,
  ): Promise<QrCodeResult> {
    const resume = await this.findOne(id, userId);
    const origin = hostUrl || 'https://careerpilot.com.bd';

    let targetUrl = `${origin}/resumes/${resume.id}`;
    if (resume.isPublic && resume.slug) {
      targetUrl = `${origin}/r/${resume.slug}`;
    }

    const qrCode = await this.generateQrCode(targetUrl);
    return {
      id: resume.id,
      title: resume.title,
      isPublic: resume.isPublic,
      targetUrl,
      qrCode,
    };
  }

  async update(id: string, userId: string, updateResumeDto: UpdateResumeDto) {
    const existing = await this.findOne(id, userId);

    const atsScore =
      updateResumeDto.atsScore ??
      this.calculateAtsScore(updateResumeDto, existing);

    // If slug is provided and modified, ensure uniqueness
    if (updateResumeDto.slug && updateResumeDto.slug !== existing.slug) {
      const slugExists = await this.prisma.resume.findUnique({
        where: { slug: updateResumeDto.slug },
      });
      if (slugExists) {
        throw new BadRequestException('Slug is already in use');
      }
    }

    return this.prisma.resume.update({
      where: { id },
      data: {
        ...(updateResumeDto.title && { title: updateResumeDto.title }),
        ...(updateResumeDto.template && { template: updateResumeDto.template }),
        ...(updateResumeDto.isPublic !== undefined && {
          isPublic: updateResumeDto.isPublic,
        }),
        ...(updateResumeDto.slug !== undefined && {
          slug: updateResumeDto.slug,
        }),
        atsScore,
        ...(updateResumeDto.personalInfo !== undefined && {
          personalInfo: updateResumeDto.personalInfo
            ? (updateResumeDto.personalInfo as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.summary !== undefined && {
          summary: updateResumeDto.summary,
        }),
        ...(updateResumeDto.objective !== undefined && {
          objective: updateResumeDto.objective,
        }),
        ...(updateResumeDto.experiences !== undefined && {
          experiences: updateResumeDto.experiences
            ? (updateResumeDto.experiences as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.education !== undefined && {
          education: updateResumeDto.education
            ? (updateResumeDto.education as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.skills !== undefined && {
          skills: updateResumeDto.skills
            ? (updateResumeDto.skills as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.projects !== undefined && {
          projects: updateResumeDto.projects
            ? (updateResumeDto.projects as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.certifications !== undefined && {
          certifications: updateResumeDto.certifications
            ? (updateResumeDto.certifications as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.languages !== undefined && {
          languages: updateResumeDto.languages
            ? (updateResumeDto.languages as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.awards !== undefined && {
          awards: updateResumeDto.awards
            ? (updateResumeDto.awards as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.references !== undefined && {
          references: updateResumeDto.references
            ? (updateResumeDto.references as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.bdDetails !== undefined && {
          bdDetails: updateResumeDto.bdDetails
            ? (updateResumeDto.bdDetails as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.interests !== undefined && {
          interests: updateResumeDto.interests
            ? (updateResumeDto.interests as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
        ...(updateResumeDto.design !== undefined && {
          design: updateResumeDto.design
            ? (updateResumeDto.design as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        }),
      },
    });
  }

  async duplicate(id: string, userId: string) {
    const original = await this.findOne(id, userId);

    return this.prisma.resume.create({
      data: {
        userId,
        title: `${original.title} (Copy)`,
        template: original.template,
        atsScore: original.atsScore,
        personalInfo: original.personalInfo
          ? (original.personalInfo as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        summary: original.summary,
        objective: original.objective,
        experiences: original.experiences
          ? (original.experiences as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        education: original.education
          ? (original.education as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        skills: original.skills
          ? (original.skills as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        projects: original.projects
          ? (original.projects as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        certifications: original.certifications
          ? (original.certifications as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        languages: original.languages
          ? (original.languages as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        awards: original.awards
          ? (original.awards as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        references: original.references
          ? (original.references as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        bdDetails: original.bdDetails
          ? (original.bdDetails as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        interests: original.interests
          ? (original.interests as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        design: original.design
          ? (original.design as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.resume.delete({
      where: { id },
    });
  }

  /**
   * Get all public resumes for website showcase gallery feed
   */
  async getPublicShowcase(search?: string, sort?: string) {
    const resumes = await this.prisma.resume.findMany({
      where: {
        isPublic: true,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { summary: { contains: search, mode: 'insensitive' } },
            { objective: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            comments: true,
            ratings: true,
          },
        },
      },
      orderBy:
        sort === 'popular'
          ? { viewsCount: 'desc' }
          : sort === 'top-rated'
            ? { atsScore: 'desc' }
            : { createdAt: 'desc' },
      take: 40,
    });

    return resumes.map((r) => {
      const totalRatingScore = r.ratings.reduce(
        (sum, item) => sum + item.rating,
        0,
      );
      const ratingCount = r.ratings.length;
      const averageRating =
        ratingCount > 0
          ? Math.round((totalRatingScore / ratingCount) * 10) / 10
          : 5.0;

      const personal = r.personalInfo as PersonalInfoDto | null;

      return {
        id: r.id,
        title: r.title,
        template: r.template,
        atsScore: r.atsScore,
        slug: r.slug,
        viewsCount: r.viewsCount,
        downloadsCount: r.downloadsCount,
        averageRating,
        ratingCount,
        commentsCount: r._count.comments,
        author: {
          name: r.user.name || personal?.fullName || 'Anonymous',
          avatar: r.user.avatar || personal?.avatar,
          jobTitle: personal?.jobTitle,
        },
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });
  }

  /**
   * Submit or update rating (1 to 5 stars) for a public resume
   */
  async rateResume(resumeId: string, userId: string, rating: number) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || !resume.isPublic) {
      throw new NotFoundException('Public resume not found or is private');
    }

    const upsertedRating = await this.prisma.resumeRating.upsert({
      where: {
        resumeId_userId: {
          resumeId,
          userId,
        },
      },
      create: {
        resumeId,
        userId,
        rating,
      },
      update: {
        rating,
      },
    });

    // Calculate new aggregate rating stats
    const allRatings = await this.prisma.resumeRating.findMany({
      where: { resumeId },
    });

    const totalScore = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const ratingCount = allRatings.length;
    const averageRating =
      ratingCount > 0
        ? Math.round((totalScore / ratingCount) * 10) / 10
        : rating;

    return {
      message: 'Rating submitted successfully',
      rating: upsertedRating.rating,
      averageRating,
      ratingCount,
    };
  }

  /**
   * Add a comment to a public resume
   */
  async addComment(resumeId: string, userId: string, content: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || !resume.isPublic) {
      throw new NotFoundException('Public resume not found or is private');
    }

    const comment = await this.prisma.resumeComment.create({
      data: {
        resumeId,
        userId,
        content,
        status: 'approved',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      status: comment.status,
      createdAt: comment.createdAt,
      author: {
        id: comment.user.id,
        name: comment.user.name || 'User',
        avatar: comment.user.avatar,
      },
    };
  }

  /**
   * Get all approved comments for a public resume
   */
  async getCommentsForResume(resumeId: string) {
    const comments = await this.prisma.resumeComment.findMany({
      where: {
        resumeId,
        status: 'approved',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: {
        id: c.user.id,
        name: c.user.name || 'User',
        avatar: c.user.avatar,
      },
    }));
  }

  /**
   * Delete user's own comment
   */
  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.resumeComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID "${commentId}" not found`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.resumeComment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
  }
}
