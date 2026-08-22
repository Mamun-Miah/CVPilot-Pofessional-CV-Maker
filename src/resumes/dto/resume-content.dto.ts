import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PersonalInfoDto {
  @ApiPropertyOptional({ example: 'Rahim Ahmed', description: 'Full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    example: 'Senior Software Engineer',
    description: 'Target or current job title',
  })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({
    example: 'rahim.ahmed@example.com',
    description: 'Contact email',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: '+880 1711 234567',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Dhaka, Bangladesh',
    description: 'Location',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: 'https://rahimahmed.dev',
    description: 'Personal website URL',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    example: 'linkedin.com/in/rahimahmed',
    description: 'LinkedIn profile link',
  })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({
    example: 'github.com/rahimahmed',
    description: 'GitHub profile link',
  })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Profile picture / Avatar URL',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class ExperienceItemDto {
  @ApiPropertyOptional({ example: 'exp-1', description: 'Unique identifier' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    example: 'Senior Software Engineer',
    description: 'Job position title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Senior Software Engineer',
    description: 'Job position title (form alias)',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    example: 'Brain Station 23',
    description: 'Company name',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    example: 'Dhaka, Bangladesh',
    description: 'Company location',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: '2022-06',
    description: 'Start date (YYYY-MM)',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    example: 'Present',
    description: 'End date or Present (YYYY-MM)',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether user currently works here',
  })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiPropertyOptional({
    example: [
      'Architected microservices migration reducing deployment time by 70%',
      'Led adoption of TypeScript across 12+ repositories improving code quality',
      'Mentored 6 junior engineers, with 3 promoted to mid-level within a year',
      'Built real-time analytics dashboard serving 50K+ daily active users',
    ],
    description:
      'Bullet points highlighting key responsibilities and achievements',
  })
  @IsOptional()
  @IsArray()
  bullets?: string[];

  @ApiPropertyOptional({
    example: [
      'Architected microservices migration reducing deployment time by 70%',
      'Led adoption of TypeScript across 12+ repositories improving code quality',
      'Mentored 6 junior engineers, with 3 promoted to mid-level within a year',
      'Built real-time analytics dashboard serving 50K+ daily active users',
    ],
    description: 'Highlights text array (one item per line in UI)',
  })
  @IsOptional()
  @IsArray()
  highlights?: string[];

  @ApiPropertyOptional({
    example: 'Led backend microservices team.',
    description: 'General description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class EducationItemDto {
  @ApiPropertyOptional({ example: 'edu-1', description: 'Unique identifier' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    example: 'B.Sc. in Computer Science and Engineering',
    description: 'Degree name',
  })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional({
    example: 'Bangladesh University of Engineering and Technology',
    description: 'Educational institution name',
  })
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiPropertyOptional({
    example: 'Dhaka, Bangladesh',
    description: 'Institution location',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: '2015', description: 'Start year' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2019', description: 'End year' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: '3.78/4.00', description: 'CGPA or grade' })
  @IsOptional()
  @IsString()
  cgpa?: string;
}

export class SkillItemDto {
  @ApiPropertyOptional({ example: 'skill-1', description: 'Unique identifier' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    example: 'JavaScript/TypeScript',
    description: 'Skill name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Skill proficiency level percentage (0-100)',
  })
  @IsOptional()
  @IsNumber()
  level?: number;

  @ApiPropertyOptional({
    example: 'Programming Languages',
    description: 'Skill category',
  })
  @IsOptional()
  @IsString()
  category?: string;
}

export class ProjectItemDto {
  @ApiPropertyOptional({ example: 'proj-1', description: 'Unique identifier' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    example: 'CareerPilot BD',
    description: 'Project name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'careerpilot.com.bd',
    description: 'Project link',
  })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({
    example: 'AI-powered resume builder for the Bangladesh job market',
    description: 'Project description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind'],
    description: 'Tech stack tags',
  })
  @IsOptional()
  @IsArray()
  technologies?: string[];
}

export class CertificationItemDto {
  @ApiPropertyOptional({ example: 'cert-1', description: 'Unique identifier' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    example: 'AWS Solutions Architect Associate',
    description: 'Certification title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Amazon Web Services',
    description: 'Issuing organization',
  })
  @IsOptional()
  @IsString()
  issuer?: string;

  @ApiPropertyOptional({ example: 'Aug 2023', description: 'Issue date' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({
    example: 'https://aws.amazon.com/verification',
    description: 'Verification URL',
  })
  @IsOptional()
  @IsString()
  link?: string;
}

export class LanguageItemDto {
  @ApiPropertyOptional({ example: 'lang-1', description: 'Unique identifier' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ example: 'Bengali', description: 'Language name' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    example: 'native',
    description: 'Proficiency (native, fluent, conversational)',
  })
  @IsOptional()
  @IsString()
  proficiency?: string;
}

export class AwardItemDto {
  @ApiPropertyOptional({ example: 'award-1', description: 'Unique identifier' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    example: 'Employee of the Year',
    description: 'Award title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Brain Station 23', description: 'Issuer' })
  @IsOptional()
  @IsString()
  issuer?: string;

  @ApiPropertyOptional({ example: '2023', description: 'Date awarded' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({
    example: 'Awarded for technical leadership',
    description: 'Award description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class ReferenceItemDto {
  @ApiPropertyOptional({ example: 'ref-1', description: 'Unique identifier' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    example: 'Tanvir Hasan',
    description: 'Reference person full name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Former Team Lead',
    description: 'Relationship or position',
  })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiPropertyOptional({ example: 'ShopUp', description: 'Company name' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    example: 'tanvir@example.com',
    description: 'Contact email / phone',
  })
  @IsOptional()
  @IsString()
  contact?: string;
}

export class BdDetailsDto {
  @ApiPropertyOptional({
    example: 'Mohammed Karim',
    description: "Father's Name",
  })
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiPropertyOptional({
    example: 'Fatima Begum',
    description: "Mother's Name",
  })
  @IsOptional()
  @IsString()
  motherName?: string;

  @ApiPropertyOptional({
    example: '1995-05-15',
    description: 'Date of Birth (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiPropertyOptional({ example: 'Male', description: 'Gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: 'Islam', description: 'Religion' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiPropertyOptional({
    example: 'Single',
    description: 'Marital Status',
  })
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiPropertyOptional({ example: 'Bangladeshi', description: 'Nationality' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({
    example: '1995123456789',
    description: 'National ID (NID) Number',
  })
  @IsOptional()
  @IsString()
  nidNumber?: string;

  @ApiPropertyOptional({
    example: 'A12345678',
    description: 'Passport Number',
  })
  @IsOptional()
  @IsString()
  passportNo?: string;

  @ApiPropertyOptional({
    example: 'DL123456',
    description: 'Driving License Number',
  })
  @IsOptional()
  @IsString()
  drivingLicense?: string;

  @ApiPropertyOptional({
    example: '৳80,000 - ৳1,20,000',
    description: 'Expected Salary',
  })
  @IsOptional()
  @IsString()
  expectedSalary?: string;

  @ApiPropertyOptional({
    example: 'Dhaka, Chittagong',
    description: 'Preferred Job Locations',
  })
  @IsOptional()
  @IsString()
  preferredLocation?: string;

  @ApiPropertyOptional({
    example: 'Single',
    description: 'Status (Legacy field)',
  })
  @IsOptional()
  @IsString()
  status?: string;
}

export class DesignDto {
  @ApiPropertyOptional({
    example: '#0f766e',
    description: 'Primary brand / theme color',
  })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({ example: 'Inter', description: 'Font family' })
  @IsOptional()
  @IsString()
  fontFamily?: string;

  @ApiPropertyOptional({
    example: 'modern-professional',
    description: 'Selected template ID',
  })
  @IsOptional()
  @IsString()
  template?: string;
}
