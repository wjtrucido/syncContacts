import dotenv from 'dotenv'
dotenv.config();

import express from 'express'

import mongoose from 'mongoose'
import cors from 'cors'
import router from './src/routes/routes'

//Mongoose config
mongoose.set('strictQuery', true)
const root: string = '/app-sync/'
const MONGODB_URI = process.env.MONGODB_URI

export const app = express();

const whitelist = ['https://*.admin.mailchimp.com'];
const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(MONGODB_URI!)
    .then(() => console.log('Conexión a la base de datos exitosa.'))
    .catch(err => console.error(err));

//Rutes
app.use(root, router)