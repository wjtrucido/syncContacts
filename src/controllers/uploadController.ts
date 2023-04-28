import { Request, Response } from 'express';
import { uploadContactsService } from '../services/uploadService';
import { sendContactsToMailChimpService } from '../services/sendContactsToMailChimpService';

export const uploadController = async (req: Request, res: Response) => {
    try {
        await uploadContactsService(req, res);
        sendContactsToMailChimpService();
    } catch (error) {
        res.status(500).json({
            error: 'Error uploading the file'
        });
    }
}