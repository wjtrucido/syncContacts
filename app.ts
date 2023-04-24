import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import bodyParser from 'body-parser'

import mongoose from 'mongoose'
import cors from 'cors'
import router from './src/routes/routes'

//Mongoose config
mongoose.set('strictQuery', true)
const root: string = '/appsync/'
const MONGODB_URI = process.env.MONGODB_URI

export const app = express();

app.use(cors({
    origin: ['https://*.admin.mailchimp.com'],
    methods: ['POST']
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(MONGODB_URI!)
    .then(() => console.log('Conexión a la base de datos exitosa.'))
    .catch(err => console.error(err));

//Rutes
app.use(root, router)