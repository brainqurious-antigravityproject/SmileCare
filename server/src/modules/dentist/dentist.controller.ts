import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const getDentists = async (req: Request, res: Response): Promise<void> => {
    try {
        const dentists = await prisma.dentist.findMany({
            select: {
                id: true,
                specialization: true,  // NOT "specialty"
                photoUrl: true,        // NOT "image"
                user: {
                    select: { name: true }  // name is on User, not Dentist
                },
            },
        });

        // Flatten for frontend convenience
        const result = dentists.map(d => ({
            id: d.id,
            name: d.user.name,
            specialization: d.specialization,
            photoUrl: d.photoUrl,
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('[getDentists]', error);
        res.status(500).json({ message: 'Failed to fetch dentists' });
    }
};
