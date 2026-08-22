import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  AwardItemDto,
  BdDetailsDto,
  CertificationItemDto,
  DesignDto,
  EducationItemDto,
  ExperienceItemDto,
  LanguageItemDto,
  PersonalInfoDto,
  ProjectItemDto,
  ReferenceItemDto,
  SkillItemDto,
} from './resume-content.dto';

export class CreateResumeDto {
  @ApiPropertyOptional({
    example: 'My Professional Resume',
    description: 'Title of the resume document',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'modern-professional',
    description: 'Selected resume template theme identifier',
  })
  @IsOptional()
  @IsString()
  template?: string;

  @ApiPropertyOptional({
    type: PersonalInfoDto,
    description: 'Personal contact information',
    example: {
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
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo?: PersonalInfoDto;

  @ApiPropertyOptional({
    example:
      'Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture.',
    description: 'Professional summary or bio paragraph',
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({
    example:
      'Seeking a challenging Senior Software Engineer position at a forward-thinking company where I can leverage my expertise in full-stack development, system design, and team leadership to drive innovation and deliver exceptional user experiences.',
    description: 'Career objective statement',
  })
  @IsOptional()
  @IsString()
  objective?: string;

  @ApiPropertyOptional({
    type: [ExperienceItemDto],
    description: 'List of work experience entries',
    example: [
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
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceItemDto)
  experiences?: ExperienceItemDto[];

  @ApiPropertyOptional({
    type: [EducationItemDto],
    description: 'List of education entries',
    example: [
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
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationItemDto)
  education?: EducationItemDto[];

  @ApiPropertyOptional({
    type: [SkillItemDto],
    description: 'List of skills and proficiency levels',
    example: [
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
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillItemDto)
  skills?: SkillItemDto[];

  @ApiPropertyOptional({
    type: [ProjectItemDto],
    description: 'List of portfolio projects',
    example: [
      {
        id: 'proj-1',
        name: 'CareerPilot BD',
        link: 'careerpilot.com.bd',
        description: 'AI-powered resume builder for the Bangladesh job market',
        technologies: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind'],
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectItemDto)
  projects?: ProjectItemDto[];

  @ApiPropertyOptional({
    type: [CertificationItemDto],
    description: 'List of professional certifications',
    example: [
      {
        id: 'cert-1',
        title: 'AWS Solutions Architect Associate',
        issuer: 'Amazon Web Services',
        date: 'Aug 2023',
        link: 'https://aws.amazon.com/verification',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationItemDto)
  certifications?: CertificationItemDto[];

  @ApiPropertyOptional({
    type: [LanguageItemDto],
    description: 'List of spoken/written languages',
    example: [
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
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageItemDto)
  languages?: LanguageItemDto[];

  @ApiPropertyOptional({
    type: [AwardItemDto],
    description: 'List of awards and achievements',
    example: [
      {
        id: 'award-1',
        title: 'Employee of the Year',
        issuer: 'Brain Station 23',
        date: '2023',
        description: 'Awarded for exceptional technical leadership.',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AwardItemDto)
  awards?: AwardItemDto[];

  @ApiPropertyOptional({
    type: [ReferenceItemDto],
    description: 'List of job references',
    example: [
      {
        id: 'ref-1',
        name: 'Tanvir Hasan',
        relationship: 'Former Team Lead',
        company: 'ShopUp',
        contact: 'tanvir@example.com',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferenceItemDto)
  references?: ReferenceItemDto[];

  @ApiPropertyOptional({
    type: BdDetailsDto,
    description:
      'Bangladesh specific personal details (Parents, DOB, Gender, Religion, Marital Status, Nationality, NID, Passport, Driving License, Expected Salary, Preferred Location)',
    example: {
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
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BdDetailsDto)
  bdDetails?: BdDetailsDto;

  @ApiPropertyOptional({
    example: ['Open Source', 'Chess', 'Cricket', 'Reading', 'Travel'],
    description: 'List of personal interests / hobbies',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({
    type: DesignDto,
    description: 'Custom styling and template theme configurations',
    example: {
      primaryColor: '#0f766e',
      fontFamily: 'Inter',
      template: 'modern-professional',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DesignDto)
  design?: DesignDto;
}
