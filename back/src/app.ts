import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { downloadFile, uploadFile } from './controllers/files.controllers';
import multer from 'multer';
import { checkOrCreateDir } from './utils/checkOrCreateDir';
import PATHS from './constants/paths';
import { pinoHttp } from 'pino-http';
import logger from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';

checkOrCreateDir(PATHS.UPLOAD_DIR_PATH);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATHS.UPLOAD_DIR_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3040;

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(errorHandler);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');

  next();
});

// Use routes
app.get('/', (req: Request, res: Response): void => {
  res.status(200).send('Hello World! POST to /upload to zip your CSV.');
});

app.get('/downloads/:id', downloadFile);

app.post('/upload', upload.single('file'), uploadFile);

// Start Express server
app.listen(port, () => {
  logger.info(`Server started at http://localhost:${port}`);
});

export default app;
