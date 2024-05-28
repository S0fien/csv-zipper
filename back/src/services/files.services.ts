import type { RowType } from '../types/RowType';
import fs from 'fs';
import * as csv from 'fast-csv';
import { OnEndInterface } from '../interfaces/OnEnd.interface';
import path from 'path';
import PATHS from '../constants/paths';
import server from '../utils/websocketServer';
import { COLUMNS } from '../constants/columns';
import type { Request } from 'express';
import { CreateArchiveInterface } from '../interfaces/CreateArchive.interface';
import archiver from 'archiver';
import type { FileType } from '../types/FileType';
import logger from '../utils/logger';
import { deleteFile, deleteFolder } from '../utils/checkOrCreateDir';

export const FilesServices = {
  validateCsvFile: async function (filePath: string) {
    return await new Promise((resolve, reject) => {
      const errors: string[] = [];
      const rows: RowType[] = [];

      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => {
          reject(error);
        })
        .on('data', (row) => {
          try {
            FilesServices.validateRow(row);
            rows.push(row);
          } catch (e) {
            const error = e as Error;
            errors.push(error['message']);
            reject('Data validation failed in validateCsvFile.');
          }
        })
        .on('end', (rowCount: number) => {
          if (errors.length > 0) {
            reject(`Validation errors: ${errors.join(', ')}`);
          } else {
            logger.info(`Parsed ${rowCount} rows`);
            resolve(rows);
          }
        });
    });
  },

  onEnd: async ({ file, maleStream, femaleStream }: OnEndInterface) => {
    fs.unlink(file!.path, (err) => {
      if (err != null) throw err;
    });
    maleStream.end();
    femaleStream.end();

    // ZIPPING PART
    logger.info('Start zipping');
    const outputFilePath = path.join(PATHS.OUTPUT_FILE_PATH);
    const uploadDirPath = path.join(PATHS.UPLOAD_DIR_PATH);
    const output = fs.createWriteStream(outputFilePath);
    try {
      const files = [
        { path: PATHS.MALE_FILE_PATH, name: 'GENDER_MALE_ONLY.csv' },
        { path: PATHS.FEMALE_FILE_PATH, name: 'GENDER_FEMALE_ONLY.csv' },
      ];
      const zip = await FilesServices.createArchive({
        output,
        outputFilePath,
        files,
      });
      server.clients.forEach((client) => {
        client.send(JSON.stringify(zip));
      });
      // Cleaning
      files.forEach((file: { path: fs.PathLike }) => {
        deleteFile(path.join(file.path.toString()));
      });
      deleteFile(outputFilePath);
      deleteFolder(uploadDirPath);
      logger.info('PROCESS FINISH WITH SUCCESS');
    } catch (e) {
      logger.error('ERROR: Zipping failed', e);
      throw new Error('Zipping failed');
    }
  },

  createFilesAndHeaders: () => {
    const maleStream = fs.createWriteStream(PATHS.MALE_FILE_PATH);
    const femaleStream = fs.createWriteStream(PATHS.FEMALE_FILE_PATH);

    const headers = COLUMNS;
    maleStream.write(headers.join(',') + '\n');
    femaleStream.write(headers.join(',') + '\n');

    return { maleStream, femaleStream };
  },

  transformCsvFile: async (req: Request): Promise<void> => {
    if (req.file != null) {
      try {
        const { file } = req;
        const { maleStream, femaleStream } = FilesServices.createFilesAndHeaders();

        // PARSING CSV PART
        logger.info('Starting parsing CSV.');
        const parsedCsv = csv.parse({ headers: true });
        fs.createReadStream(file.path)
          .pipe(parsedCsv)
          .on('data', (row) => {
            const line = Object.values(row).join(',') + '\n';
            if (row.gender.toLowerCase() === 'male') {
              maleStream.write(line);
            } else if (row.gender.toLowerCase() === 'female') {
              femaleStream.write(line);
            }
          })
          .on('error', (error) => {
            logger.error('ERROR: Could not parse CSV', error);
            throw new Error('Could not parse CSV;');
          })
          .on('end', async () => {
            await FilesServices.onEnd({
              file,
              maleStream,
              femaleStream,
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
  validateRow: (row: RowType) => {
    const rowColumns = Object.keys(row);
    if (rowColumns.toString() !== COLUMNS.toString()) {
      throw new Error('Missing specifics columns in file. Please try a valid format with all columns needed.');
    }
  },

  createArchive: async ({ output, files, outputFilePath }: CreateArchiveInterface) => {
    return await new Promise((resolve, reject) => {
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      archive.pipe(output);
      files.forEach((file: FileType) => {
        archive.append(fs.createReadStream(file.path), { name: file.name });
      });
      archive.finalize();

      output.on('close', async () => {
        fs.readFile(outputFilePath, (err, data) => {
          if (err) reject(new Error('Cannot read file'));
          else {
            resolve({
              event: 'archive',
              success: true,
              status: 'success',
              message: 'Archive is ready!',
              file: data,
            });
          }
        });
      });

      archive.on('error', (err) => {
        reject({
          event: 'archive',
          success: false,
          status: 'error',
          message: err.message,
          file: null,
        });
      });
    });
  },
};
