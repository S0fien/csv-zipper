import type { FileHeaderType } from '../types/FileHeaderType';
import fs from 'fs';
import * as csv from 'fast-csv';
import { OnEndType } from '../types/OnEndType';
import path from 'path';
import PATHS from '../constants/paths';
import server from '../utils/websocketServer';
import { COLUMNS } from '../constants/columns';
import type { Request } from 'express';
import logger from '../utils/logger';
import { deleteFile, deleteFolder } from '../utils/checkOrCreateDir';
import archiver from 'archiver';

export const FilesServices = {
  validateCsvFile: async (filePath: string) => {
    return await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => {
          reject(error);
        })
        .on('headers', (headers) => {
          try {
            FilesServices._validateHeaders(headers);
            resolve(headers)
          } catch (e) {
            const error = e as Error;
            reject(`Data validation failed in validateCsvFile: ${error.message}`);
          }
        })
    })
  },

  _onEnd: async ({ file, maleCsv, femaleCsv }: OnEndType) => {
    fs.unlink(file!.path, (err) => {
      if (err != null) throw err;
    });
    // ZIPPING PART
    logger.info('Start zipping');
    try {
      const zip = await FilesServices._createArchive( maleCsv, femaleCsv);
      server.clients.forEach((client) => {
        client.send(JSON.stringify(zip));
      });
      FilesServices._cleanFiles()
      logger.info('A process just finished with success.');
    } catch (e) {
      logger.error('ERROR: Zipping failed', e);
      throw new Error('Zipping failed');
    }
  },

  _createFilesAndHeaders: (maleFilePath: string, femaleFilePath: string) => {

    const maleCsv = fs.createWriteStream(maleFilePath);
    const femaleCsv = fs.createWriteStream(femaleFilePath);
    const headers = COLUMNS;
    maleCsv.write(headers + '\n');
    femaleCsv.write(headers + '\n');

    return { maleCsv, femaleCsv };
  },

  transformCsvFile: async (req: Request): Promise<void> => {
    if (req.file != null) {
      try {
        const { file } = req;
        const maleFilePath = path.join(PATHS.MALE_FILE_PATH);
        const femaleFilePath = path.join(PATHS.FEMALE_FILE_PATH);
        const { maleCsv, femaleCsv } = FilesServices._createFilesAndHeaders(maleFilePath, femaleFilePath);

        // PARSING CSV PART
        logger.info('Starting parsing CSV.');
        const parsedCsv = csv.parse({ headers: true });
        const readStream = fs.createReadStream(file.path);
        fs.createReadStream(file.path)
          .pipe(parsedCsv)
          .on('data', (row) => {
            const { gender } = row
            const rowString = Object.values(row).join(',') + '\n';
            if (gender.toLowerCase() === 'male') {
              if (!maleCsv.write(rowString)) {
                readStream.pause();
                maleCsv.once('drain', () => readStream.resume());
              }
            } else if (gender.toLowerCase() === 'female') {
              if (!femaleCsv.write(rowString)) {
                readStream.pause();
                femaleCsv.once('drain', () => readStream.resume());
              }
            }
          })
          .on('error', (error) => {
            logger.error(`ERROR: Could not parse CSV : ${error.message}`);
            throw new Error('Could not parse CSV;');
          })
          .on('end', async () => {
            maleCsv.end();
            femaleCsv.end();
            await FilesServices._onEnd({
              file,
              maleCsv: maleFilePath,
              femaleCsv: femaleFilePath,
            });
          });
      } catch (e) {
        logger.info('ERROR: Transform process failed', e);
        throw new Error('Transform process failed.');
      }
    } else {
      throw new Error('File not present in request.');
    }
  },

  _validateHeaders: (headers: FileHeaderType) => {
    if (!headers.includes('gender')) {
      logger.error('Validation failed : missing column gender.')
      throw new Error('Validation failed : missing column gender.');
    }
  },

  _cleanFiles: () => {
    // Cleaning
    deleteFile(path.join(PATHS.OUTPUT_FILE_PATH));
    deleteFolder(path.join(PATHS.UPLOAD_DIR_PATH));
  },

  _createArchive: (maleFilePath: string, femaleFilePath: string) => {
    return new Promise((resolve, reject) => {
      const outputFilePath = path.join(PATHS.OUTPUT_FILE_PATH);
      const output = fs.createWriteStream(outputFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Niveau de compression
      });

      output.on('close', () => {
        logger.info(`Archive created successfully. Total bytes: ${archive.pointer()}`);
        resolve({
          event: 'archive',
          success: true,
          status: 'success',
          message: 'Archive is ready!',
          file: fs.createReadStream(outputFilePath),
        });
      });

      archive.on('error', (err: Error) => {
        logger.error(`Error creating zip archive: ${err.message}`);
        reject(err.message);
      });

      archive.pipe(output);

      archive.append(fs.createReadStream(maleFilePath), { name: 'GENDER_MALE_ONLY.csv' });
      archive.append(fs.createReadStream(femaleFilePath), { name: 'GENDER_FEMALE_ONLY.csv' });

      archive.finalize();
    })
  }
};
