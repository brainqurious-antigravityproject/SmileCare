import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { prisma } from './lib/prisma';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
import authRoutes from './routes/authRoutes';
import bookingRoutes from './modules/booking/booking.routes';
import paymentRoutes from './modules/payment/payment.routes';
import patientRoutes from './modules/patient/patient.routes';
import supportRoutes from './modules/support/support.routes';
import treatmentRoutes from './modules/treatment/treatment.routes';
import dentistRoutes from './modules/dentist/dentist.routes';
app.use('/api/auth', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api', paymentRoutes);
app.use('/api', patientRoutes);
app.use('/api', supportRoutes);
app.use('/api', treatmentRoutes);
app.use('/api', dentistRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'SmileCare API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app, prisma };
