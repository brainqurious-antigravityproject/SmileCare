import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

dotenv.config();

// Strip any sslmode query param from the connection string
// so pg-connection-string doesn't override our ssl config below
const rawUrl = process.env.DATABASE_URL!;
const connectionString = rawUrl.replace(/[?&]sslmode=[^&]*/g, (match) => {
    // If sslmode was the first query param (after ?), remove ? too
    return match.startsWith('?') ? '' : match.replace(/^&/, '?');
});

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false, // Required for Supabase dev pooler (self-signed cert)
    },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
