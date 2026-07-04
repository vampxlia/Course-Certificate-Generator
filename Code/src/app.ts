import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

dotenv.config({path: path.join(__dirname, '../.env')});

//@ts-ignore, the IDE complains there's no actual routes object since we're importing the whole folder
import routes from './routes';
const app = express();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '../public')))
app.use('/generated', express.static(path.join(__dirname, '../output')))
console.log(path.join(__dirname, '../public'))

app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});