import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const getTreatments = async (req: Request, res: Response): Promise<void> => {
    try {
        const treatments = await prisma.treatment.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,           // NOT "title"
                description: true,
                priceRange: true,     // NOT "price"
                imageUrl: true,
                category: {
                    select: { name: true }
                },
            },
        });
        res.status(200).json(treatments);
    } catch (error) {
        console.error('[getTreatments]', error);
        res.status(500).json({ message: 'Failed to fetch treatments' });
    }
};
