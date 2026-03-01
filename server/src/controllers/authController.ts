import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password, role } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or phone already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                passwordHash: hashedPassword,
                role: role || 'patient'
            }
        });

        // Create profile based on role
        if (user.role === 'patient') {
            await prisma.patient.create({ data: { userId: user.id } });
        } else if (user.role === 'dentist') {
            await prisma.dentist.create({ data: { userId: user.id, specialization: 'General Dentistry' } });
        }

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.cookie('accessToken', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // true in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true in production
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { id: true, name: true, email: true, phone: true, role: true }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
