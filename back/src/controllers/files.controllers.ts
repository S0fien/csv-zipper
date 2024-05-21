import { type Request, type Response } from "express";
import * as fs from "fs";
import { FilesServices } from "../services/files.services";

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      errorMessage: 'No file found in request.'
    })
  } else {
    try {
      console.log('PROCESS START')
      await FilesServices.validateCsvFile(req.file?.path)
      console.log('SUCCESS: File has been uploaded. Starting dividing CSV and zipping it.')
      res.status(200).json({
        message: 'File uploaded successfully.'
      })
      await FilesServices.transformCsvFile(req)
    } catch (e) {
      const error = e as Error
      console.log('PROCESS FAILED', error)
      res.status(500).json({
        errorMessage: error.message
      })
    }
  }
}

export const downloadFile = (req: Request, res: Response) => {
  fs.readFile(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send('Cannot read file')
    } else {
      res.status(200).send(data)
      fs.unlink(req.params.id, (err) => {
        if (err) {
          console.error('Cannot unlink file', err)
        }
      })
    }
  })
}
