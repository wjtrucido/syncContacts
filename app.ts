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

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI!)
    .then(() => console.log('Conexión a la base de datos exitosa.'))
    .catch(err => console.error(err));

//Rutes
app.use(root, router)