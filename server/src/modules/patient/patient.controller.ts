import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import {
    getPatientProfile,
    updatePatientProfile,
    getUpcomingAppointments,
    getAppointmentHistory,
    getDocuments,
} from './patient.service';

// GET /api/patient/me
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await getPatientProfile(req.user!.id);
        res.json(profile);
    } catch (error: any) {
        console.error('getProfile error:', error);
        res.status(404).json({ message: error.message || 'Profile not found' });
    }
};

// PUT /api/patient/me
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, phone, dob } = req.body;
        const profile = await updatePatientProfile(req.user!.id, { name, phone, dob });
        res.json(profile);
    } catch (error: any) {
        console.error('updateProfile error:', error);
        res.status(500).json({ message: error.message || 'Update failed' });
    }
};

// GET /api/patient/appointments/upcoming
export const getUpcoming = async (req: AuthRequest, res: Response) => {
    try {
        const appointments = await getUpcomingAppointments(req.user!.id);
        res.json(appointments);
    } catch (error: any) {
        console.error('getUpcoming error:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
    }
};

// GET /api/patient/appointments/history
export const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const history = await getAppointmentHistory(req.user!.id);
        res.json(history);
    } catch (error: any) {
        console.error('getHistory error:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch history' });
    }
};

// GET /api/patient/documents
export const getDocs = async (req: AuthRequest, res: Response) => {
    try {
        const docs = await getDocuments(req.user!.id);
        res.json(docs);
    } catch (error: any) {
        console.error('getDocs error:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch documents' });
    }
};
