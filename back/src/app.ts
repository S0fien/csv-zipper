import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { downloadFile, uploadFile } from "./controllers/files.controllers";
import multer from "multer";
import { checkOrCreateDir } from "./utils/checkOrCreateDir";
import PATHS from "./constants/paths";

checkOrCreateDir(PATHS.UPLOAD_DIR_PATH)

const upload = multer({ dest: PATHS.UPLOAD_DIR_PATH })

dotenv.config()
const app = express() // New express instance
const port = process.env.APP_PORT || 3000 // Port number

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Cache-Control', 'no-cache')

  next()
})

// Use routes
app.get('/', (req: Request, res: Response): void => {
  res.status(200).send('Hello World! POST to /upload to zip your CSV.')
})

app.get('/downloads/:id', downloadFile)

app.post('/upload', upload.single('file'), uploadFile)

// Start Express server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

export default app
