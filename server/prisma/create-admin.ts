import { prisma } from '../src/lib/prisma';
import * as bcrypt from 'bcryptjs';

async function main() {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@smilecare.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@smilecare.com',
            phone: '+10000000000',
            passwordHash,
            role: 'admin',
        },
    });
    console.log('✅ Admin created:', admin.email);
}

main().finally(() => prisma.$disconnect());
