# 🚀 CV Pilot — AI CV Maker Platform

> **CV Pilot** is a next-generation, AI-powered platform designed to build, optimize, and tailor professional resumes and cover letters with precision, speed, and intelligence.

---

## 🌟 Overview

**CV Pilot** empowers job seekers by combining modern full-stack web technologies with state-of-the-art AI content generation. Whether you are crafting a resume from scratch or tailoring an existing CV to match a target job description, CV Pilot automates formatting, enhances professional phrasing, and optimizes content for **Applicant Tracking Systems (ATS)**.

Built on top of **NestJS v11**, **Prisma ORM 7**, **PostgreSQL**, and **TypeScript**, CV Pilot provides a enterprise-grade, scalable, and type-safe backend architecture.

---

## ✨ Key Features

- 🤖 **AI Content Optimization**: Generate impactful summaries, work experience bullet points, and skill descriptions tailored to your industry.
- 🎯 **ATS Keyword & Score Engine**: Analyze resumes against target job postings to identify keyword gaps and increase ATS match rate.
- 📐 **Customizable Resume Templates**: Modular template engine providing clean, modern, and professional visual layouts.
- 📄 **Multi-Format Exporting**: Export resumes effortlessly into ATS-compliant PDF, Markdown, and JSON formats.
- 👤 **Profile & Version Management**: Save multiple variations of your CV targeted towards different job roles and industries.
- ⚡ **High Performance & Security**: Built with NestJS dependency injection, Prisma 7 native driver adapters, schema validation, and secure PostgreSQL persistence.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [NestJS v11](https://nestjs.com/) | Progressive Node.js framework for scalable server-side applications |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strongly typed JavaScript development |
| **Database** | [PostgreSQL 17](https://www.postgresql.org/) | Robust, relational database engine |
| **ORM** | [Prisma 7](https://www.prisma.io/) | Next-gen ORM with `@prisma/adapter-pg` driver adapter |
| **Containerization** | [Docker Compose](https://www.docker.com/) | Simplified local container database management |
| **Code Quality** | ESLint v9 & Prettier | Automated code formatting and static linting |
| **Testing** | [Jest](https://jestjs.io/) | Unit and end-to-end testing suite |

---

## 📁 Project Structure

```text
cv-pilot/
├── prisma/
│   ├── schema.prisma        # Database schema definitions (User, CV, Profile, etc.)
│   └── seed.ts              # Database seeding script for development
├── src/
│   ├── app.controller.ts    # Main app controller
│   ├── app.module.ts        # Root NestJS module & configuration loader
│   ├── app.service.ts       # Main app service logic
│   ├── main.ts              # NestJS application entrypoint
│   └── prisma.service.ts    # Prisma Client database service initialization
├── docker-compose.yml       # Docker service definition for PostgreSQL database
├── package.json             # Project dependencies and operational scripts
├── tsconfig.json            # TypeScript compiler configuration
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to set up and run **CV Pilot** on your local environment.

### Prerequisites

Ensure you have the following software installed:
- [Node.js](https://nodejs.org/) (v20.x or higher)
- [npm](https://www.npmjs.com/) (v10.x or higher)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Repository Setup

Clone the repository and install project dependencies:

```bash
git clone https://github.com/your-username/cv-pilot.git
cd cv-pilot
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and configure environment parameters:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/cv_pilot?schema=public"
```

### 3. Start Database Service

Spin up the local PostgreSQL database using Docker Compose:

```bash
docker compose up -d
```

### 4. Database Setup & Seeding

Apply Prisma migrations and seed the initial database data:

```bash
# Push schema to PostgreSQL database
npx prisma db push

# Seed initial demo data
npx prisma db seed
```

### 5. Start the Application

Run CV Pilot in development mode with auto-reload / watch mode:

```bash
npm run start:dev
```

The server will start listening on `http://localhost:3000`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run start:dev` | Starts the application in watch / development mode |
| `npm run build` | Compiles the TypeScript application to production bundle in `dist/` |
| `npm run start:prod` | Runs the compiled production server (`node dist/main`) |
| `npm run format` | Runs Prettier to format source and test files |
| `npm run lint` | Runs ESLint with auto-fix enabled |
| `npm run test` | Executes unit test suite with Jest |
| `npm run test:e2e` | Executes end-to-end test suite |
| `npm run test:cov` | Generates unit test code coverage report |

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **AI Integration**: Integration with LLM APIs (OpenAI / Gemini / Anthropic) for intelligent CV generation.
- [ ] **ATS Keyword Scorer**: Real-time scoring against job description texts.
- [ ] **PDF Generator Service**: Server-side Puppeteer or HTML-to-PDF engine for high-resolution resume exports.
- [ ] **Authentication & User Portals**: JWT / OAuth2 user authentication with role-based access control (RBAC).

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve CV Pilot, please fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the [UNLICENSED](LICENSE) terms. All rights reserved.

