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

export const getTreatmentBySlugApi = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { slug } = req.params;

        const treatment = await prisma.treatment.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                priceRange: true,
                duration: true,
                imageUrl: true,
                isActive: true,
                category: { select: { name: true } },
            },
        });

        if (!treatment) {
            res.status(404).json({ message: 'Treatment not found' });
            return;
        }

        res.status(200).json(treatment);
    } catch (error) {
        console.error('[getTreatmentBySlug]', error);
        res.status(500).json({ message: 'Failed to fetch treatment' });
    }
};
