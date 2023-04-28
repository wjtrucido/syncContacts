import { Request, Response } from 'express';
import { downloadContactsService } from '../services/downloadService';
import { getContactsFromMailchimpService } from '../services/getContactsFromMailchimpService';

export const downloadController = async (req: Request, res: Response) => {
    try {
        await getContactsFromMailchimpService();
        await downloadContactsService(req, res);
    } catch (error) {
        res.status(500).json({
            error: 'Error downloading the file'
        });
    }
}