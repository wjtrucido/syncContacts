import express, { Request, Response } from "express"
import mongoose from 'mongoose'
import multer from 'multer'
import csv from 'csv-parser'
import fs from 'fs'

import Contact from "../models/contacts";
import { sendContactsToMailChimp } from '../utils/sendContactsToMailChimp'

const router = express.Router()
const upload = multer({ dest: 'uploads/' });
const LIMIT = 10;

router.get('/home', (req: Request, res: Response) => {
    res.status(200).json({
        ok: 'Server running'
    })
})

router.post("/upload", upload.single('csvFile'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new Error('No se ha proporcionado un archivo');
        }
        const records: Array<any> = [];
        const session = await mongoose.startSession();
        session.startTransaction();
        // Procesamiento de registros del archivo CSV
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                records.push({
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
                // División de los registros en bloques de tamaño LIMIT
                for (let i = 0; i < records.length; i += LIMIT) {
                    const chunk = records.slice(i, i + LIMIT);
                    console.log('===>', chunk)
                    await Contact.insertMany(chunk, { session });
                }
                session.commitTransaction();
                res.status(201).json({ ok: 'Registros insertados correctamente' });
            });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: 'Error uploading the file'
        });
    }
});

router.post('/sync', async (req: Request, res: Response) => {
    try {
        const resp = await sendContactsToMailChimp()
        res.status(200).json({
            ok: 'ok'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: 'Ha ocurrido un error interno'
        })
    }
})

export default router