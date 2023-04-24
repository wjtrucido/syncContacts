import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import mongoose from 'mongoose'

import router from './src/routes/routes';

//Mongoose config
mongoose.set('strictQuery', true)

export const app = express();
const root: string = '/app-sync/'
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI!)
    .then(() => console.log('Conexión a la base de datos exitosa.'))
    .catch(err => console.error(err));

//Rutes
app.use(root, router)