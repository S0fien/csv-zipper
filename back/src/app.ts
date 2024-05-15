// Import express, cors, helmet and morgan
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { uploadFile } from './controllers/files.controllers';
import multer from 'multer';
import * as fs from 'fs';

const uploadsDirectory = 'uploads/';
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}
const upload = multer({ dest: uploadsDirectory });

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

app.get('/downloads/:id', (req: Request, res: Response): void => {
  const file = fs.readFile(req.params.id, (err, data) => {
    if (err) {
      throw new Error('Cannot read file');
      res.status(500).send('lol');
    }
    res.status(200).send(file);
  });
});

app.post('/upload', upload.single('file'), uploadFile);

// Start Express server
app.listen(port, () => {
  // Callback function when server is successfully started
  console.log(`Server started at http://localhost:${port}`);
});

export default app;
