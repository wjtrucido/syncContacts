import { Request, Response } from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import Contact from "../models/contacts";

export const downloadContactsService = async (req: Request, res: Response) => {
    try {
        const contacts = await Contact.find().lean();
        const csvWriter = createObjectCsvWriter({
            path: 'file.csv',
            header: [
                { id: 'firstName', title: 'First name' },
                { id: 'lastName', title: 'Last name' },
                { id: 'systemRecordId', title: 'System record ID' },
                { id: 'dateChanged', title: 'Date changed' },
                { id: 'emailAddresses_EmailAddress', title: 'Email Addresses/Email address' },
                { id: 'emailAddresses_DateChanged', title: 'Email Addresses/Date changed' },
                { id: 'todaysVisitors', title: 'Todays Visitors Attribute/Value' },
                { id: 'todaysVisitors_DateChanged', title: 'Todays Visitors Attribute/Date changed' },
                { id: 'addresses_AddressLine_1', title: 'Addresses/Address line 1' },
                { id: 'addresses_AddressLine_2', title: 'Addresses/Address line 2' },
                { id: 'addressesCity', title: 'Addresses/City' },
                { id: 'addressesZip', title: 'Addresses/ZIP' },
                { id: 'addresses_StateAbbreviation', title: 'Addresses/State abbreviation' },
                { id: 'addresses_CountryAbbreviation', title: 'Addresses/Country abbreviation' },
                { id: 'phonesNumber', title: 'Phones/Number' },
                { id: 'phones_DateChanged', title: 'Phones/Date changed' }
            ]
        });
        await csvWriter.writeRecords(contacts);
        const file = 'file.csv';
        res.download(file);
    } catch (error) {
        throw new Error('An error occurred reading the file');
    }
}