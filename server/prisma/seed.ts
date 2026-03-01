import { prisma } from '../src/lib/prisma';
import * as bcrypt from 'bcryptjs';

async function main() {
    console.log('🌱 Seeding database...');

    // ── 1. Treatment Category ──────────────────────────────────────────────
    const generalCategory = await prisma.treatmentCategory.upsert({
        where: { id: 'cat-general' },
        update: {},
        create: {
            id: 'cat-general',
            name: 'General Dentistry',
        },
    });

    const cosmeticCategory = await prisma.treatmentCategory.upsert({
        where: { id: 'cat-cosmetic' },
        update: {},
        create: {
            id: 'cat-cosmetic',
            name: 'Cosmetic Dentistry',
        },
    });

    // ── 2. Treatments ──────────────────────────────────────────────────────
    const treatments = [
        {
            id: 'treat-1',
            categoryId: generalCategory.id,
            name: 'General Checkup',
            slug: 'general-checkup',
            description: 'Comprehensive dental examination and professional cleaning.',
            priceRange: '$99',
        },
        {
            id: 'treat-2',
            categoryId: cosmeticCategory.id,
            name: 'Teeth Whitening',
            slug: 'teeth-whitening',
            description: 'Professional laser whitening for a brighter smile.',
            priceRange: '$299',
        },
        {
            id: 'treat-3',
            categoryId: cosmeticCategory.id,
            name: 'Dental Implants',
            slug: 'dental-implants',
            description: 'Permanent replacement for missing teeth.',
            priceRange: '$1999',
        },
        {
            id: 'treat-4',
            categoryId: cosmeticCategory.id,
            name: 'Invisalign Braces',
            slug: 'invisalign-braces',
            description: 'Clear aligners for a straighter smile.',
            priceRange: '$3500',
        },
        {
            id: 'treat-5',
            categoryId: generalCategory.id,
            name: 'Root Canal Therapy',
            slug: 'root-canal-therapy',
            description: 'Pain-free treatment to save infected teeth.',
            priceRange: '$799',
        },
        {
            id: 'treat-6',
            categoryId: cosmeticCategory.id,
            name: 'Porcelain Veneers',
            slug: 'porcelain-veneers',
            description: 'Custom veneers for a flawless smile.',
            priceRange: '$1200',
        },
    ];

    for (const t of treatments) {
        await prisma.treatment.upsert({
            where: { slug: t.slug },
            update: {},
            create: t,
        });
    }
    console.log(`✅ ${treatments.length} treatments seeded`);

    // ── 3. Dentist Users ───────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('Doctor@123', 10);

    const dentistUsers = [
        { id: 'user-d1', name: 'Dr. Sarah Mitchell', email: 'sarah@smilecare.com', phone: '+11111111111', specialization: 'Cosmetic Dentistry' },
        { id: 'user-d2', name: 'Dr. James Patel', email: 'james@smilecare.com', phone: '+12222222222', specialization: 'Orthodontics' },
        { id: 'user-d3', name: 'Dr. Emily Chen', email: 'emily@smilecare.com', phone: '+13333333333', specialization: 'Implantology' },
        { id: 'user-d4', name: 'Dr. Michael Torres', email: 'michael@smilecare.com', phone: '+14444444444', specialization: 'Endodontics' },
    ];

    const dentistIds: string[] = [];

    for (const du of dentistUsers) {
        const user = await prisma.user.upsert({
            where: { email: du.email },
            update: {},
            create: {
                id: du.id,
                name: du.name,
                email: du.email,
                phone: du.phone,
                passwordHash,
                role: 'dentist',
            },
        });

        const dentist = await prisma.dentist.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                specialization: du.specialization,
            },
        });

        dentistIds.push(dentist.id);
    }
    console.log(`✅ ${dentistUsers.length} dentists seeded`);

    // ── 4. Slots — generate for next 14 days for each dentist ─────────────
    const timeSlots = [
        { startTime: '09:00 AM', endTime: '09:30 AM' },
        { startTime: '09:30 AM', endTime: '10:00 AM' },
        { startTime: '10:00 AM', endTime: '10:30 AM' },
        { startTime: '10:30 AM', endTime: '11:00 AM' },
        { startTime: '11:00 AM', endTime: '11:30 AM' },
        { startTime: '02:00 PM', endTime: '02:30 PM' },
        { startTime: '02:30 PM', endTime: '03:00 PM' },
        { startTime: '03:00 PM', endTime: '03:30 PM' },
        { startTime: '03:30 PM', endTime: '04:00 PM' },
        { startTime: '04:00 PM', endTime: '04:30 PM' },
    ];

    let slotCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const dentistId of dentistIds) {
        for (let i = 1; i <= 14; i++) {
            const slotDate = new Date(today);
            slotDate.setDate(today.getDate() + i);

            // Skip Sundays (0 = Sunday)
            if (slotDate.getDay() === 0) continue;

            for (const time of timeSlots) {
                try {
                    await prisma.slot.upsert({
                        where: {
                            dentistId_date_startTime: {
                                dentistId,
                                date: slotDate,
                                startTime: time.startTime,
                            },
                        },
                        update: {},
                        create: {
                            dentistId,
                            date: slotDate,
                            startTime: time.startTime,
                            endTime: time.endTime,
                            isAvailable: true,
                            isEmergency: false,
                        },
                    });
                    slotCount++;
                } catch (e) {
                    // Skip duplicate
                }
            }
        }
    }
    console.log(`✅ ${slotCount} slots seeded`);
    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
