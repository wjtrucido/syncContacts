import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import router from './src/routes/routes';

//Mongoose config
mongoose.set('strictQuery', true);

export const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const root: string = '/app-sync/';

app.use(cors({ origin: ['https://*.admin.mailchimp.com', 'http://localhost:5173'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Connection to the database
mongoose.connect(MONGODB_URI!)
    .then(() => console.log('Database connection successful.'))
    .catch(err => console.error(err));

//Routes
app.use(root, router);