import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Super Admin user...');
  const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cvpilot.com' },
    update: {
      role: 'superadmin',
      status: 'active',
      isVerified: true,
    },
    create: {
      email: 'admin@cvpilot.com',
      name: 'Rahim Admin',
      password: hashedPassword,
      role: 'superadmin',
      status: 'active',
      isVerified: true,
    },
  });

  console.log('Super Admin user created successfully:');
  console.dir(
    {
      email: adminUser.email,
      role: adminUser.role,
      status: adminUser.status,
      password: 'AdminPassword123!',
    },
    { depth: null },
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
