import 'dotenv/config';
import express from 'express';
const app = express();
import {connect} from 'mongoose';
import Redis from 'ioredis';
import routes from './routes/index.js'

const PORT = process.env.PORT || 5050;

export const redis = new Redis({
    port: 6379,
    host: '127.0.0.1'
});

const bootstrap = async() => {
    await connect('mongodb://127.0.0.1:27017/emailverification');

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use('/api', routes);

    app.listen(PORT, () => {
        console.log(`Server is ready at ${PORT}`);
    });
};

bootstrap();