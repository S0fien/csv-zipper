import { NextFunction, type Request, type Response } from 'express';
import { FilesServices } from '../services/files.services';
import { ApiError } from '../middlewares/errorHandler';
import logger from '../utils/logger';
import path from 'path';
import PATHS from '../constants/paths';

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      errorMessage: 'No file found in request.',
    });
  } else {
    try {
      logger.info('Upload file : process start');
      await FilesServices.validateCsvFile(req.file?.path);
      logger.info('Upload file : Success! File has been uploaded. Starting dividing CSV and zipping it.');
      res.status(200).json({
        message: 'File uploaded successfully.',
      });
      await FilesServices.transformCsvFile(req);
    } catch (e) {
      const error = e as Error;
      logger.error('Upload file : process failed', error);
      next(new ApiError(500, error.message));
    }
  }
};

export const downloadFile = (req: Request, res: Response, next: NextFunction) => {
  const outputFilePath = path.join(__dirname, '/../../', PATHS.OUTPUT_FILE_PATH);
  res.sendFile(outputFilePath, (err) => {
    if (err) {
      logger.error(`Error reading file ${err.message}`)
      next(new ApiError(500, 'Cannot read file'));
    } else {
      FilesServices._cleanFiles()
    }
  });
};
