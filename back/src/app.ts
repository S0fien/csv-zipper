// Import express, cors, helmet and morgan
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { downloadFile, uploadFile } from './controllers/files.controllers';
import multer from 'multer';
import { checkOrCreateDir } from './utils/checkOrCreateDir';
import { FEMALE_FILE_PATH, MALE_FILE_PATH, UPLOAD_DIR_PATH } from './constants/PATHS';
import fs from 'fs';

checkOrCreateDir(UPLOAD_DIR_PATH);
const data = new Uint8Array(Buffer.from('Hello Node.js'));
fs.writeFile(MALE_FILE_PATH, data, 'utf8', function (err) {
  if (err) {
    console.log('Some error occured - file either not saved or corrupted file saved.');
  } else {
    console.log("It's saved!");
  }
});
fs.writeFile(FEMALE_FILE_PATH, data, 'utf8', function (err) {
  if (err) {
    console.log('Some error occured - file either not saved or corrupted file saved.');
  } else {
    console.log("It's saved!");
  }
});
const upload = multer({ dest: UPLOAD_DIR_PATH });

dotenv.config();
const app = express(); // New express instance
const port = process.env['APP_PORT'] || 3000; // Port number

app.use(cors());
app.use(helmet());
app.use(express.json());

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
  // Callback function when server is successfully started
  console.log(`Server started at http://localhost:${port}`);
});

export default app;
