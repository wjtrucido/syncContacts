import { Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
import csv from 'csv-parser';
import fs from 'fs';
import Contact from '../models/contacts';

interface Contact {
    _id: ObjectId
    firstName: string
    lastName: string
    systemRecordId: string
    dateChanged: string
    emailAddresses_EmailAddress: string
    emailAddresses_DateChanged: string
    todaysVisitors: string
    todaysVisitors_DateChanged: string
    addresses_AddressLine_1: string
    addresses_AddressLine_2: string
    addressesCity: string
    addressesZip: string
    addresses_StateAbbreviation: string
    addresses_CountryAbbreviation: string
    phonesNumber: string
    phones_DateChanged: string
}

export const uploadContactsService = async (req: Request, res: Response) => {
    const limit = 10;
    let numberOfDocuments: number = 0;

    if (!req.file) {
        throw new Error('No file has been provided');
    }
    const records: Array<Contact> = [];
    const session = await mongoose.startSession();
    session.startTransaction();

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            records.push(<Contact>{
                firstName: data['First name'],
                lastName: data['Last/Organization/Group/Household name'],
                systemRecordId: data['System record ID'],
                dateChanged: data['Date changed'],
                emailAddresses_EmailAddress: data['Email Addresses\\Email address'],
                emailAddresses_DateChanged: data['Email Addresses\\Date changed'],
                todaysVisitors: data['Todays Visitors Attribute\\Value'],
                todaysVisitors_DateChanged: data['Todays Visitors Attribute\\Date changed'],
                addresses_AddressLine_1: data['Addresses\\Address line 1'],
                addresses_AddressLine_2: data['Addresses\\Address line 2'],
                addressesCity: data['Addresses\\City'],
                addressesZip: data['Addresses\\ZIP'],
                addresses_StateAbbreviation: data['Addresses\\State abbreviation'],
                addresses_CountryAbbreviation: data['Addresses\\Country abbreviation'],
                phonesNumber: data['Phones\\Number'],
                phones_DateChanged: data['Phones\\Date changed'],
            });
        })
        .on('end', async () => {
            for (let i = 0; i < records.length; i += limit) {
                const chunk = records.slice(i, i + limit);
                await Contact.insertMany(chunk, { session });
            }
            session.commitTransaction();
            try {
                numberOfDocuments = await Contact.countDocuments();
            } catch (error) {
                throw new Error('Error when trying to obtain the number of records');
            }
            return res.status(201).json({ ok: `${numberOfDocuments} records uploaded successfully!.` });
        });
}