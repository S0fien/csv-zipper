import { NextFunction, type Request, type Response } from 'express';
import * as fs from 'fs';
import { FilesServices } from '../services/files.services';
import { ApiError } from '../middlewares/errorHandler';

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      errorMessage: 'No file found in request.'
    })
  } else {
    try {
      console.log('uploadFile: PROCESS START')
      await FilesServices.validateCsvFile(req.file?.path)
      console.log('uploadFile: SUCCESS => File has been uploaded. Starting dividing CSV and zipping it.')
      res.status(200).json({
        message: 'File uploaded successfully.'
      })
      await FilesServices.transformCsvFile(req)
    } catch (e) {
      const error = e as Error
      next(new ApiError(500, error.message))
      console.error('uploadFile: PROCESS FAILED => ', error)
    }
  }
}

export const downloadFile = (req: Request, res: Response, next: NextFunction) => {
  fs.readFile(req.params.id, (err, data) => {
    if (err) {
      next(new ApiError(500, 'Cannot read file'))
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
