import { Request, Response } from "express";
import * as fs from "fs";
import archiver from "archiver";
import * as path from "path";
import * as csv from "fast-csv";
import server from "../utils/websocketServer";
import { FEMALE_FILE_PATH, MALE_FILE_PATH, OUTPUT_FILE_PATH } from "../constants/PATHS";
import { FileType } from "../types/FileType";
import { RowType } from "../types/RowType";
import { onEndInterface } from "../interfaces/onEndInterface";
import { COLUMNS } from "../constants/COLUMNS";

// @ts-ignore
function validateCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const errors: any[] = [];
    const rows: RowType[] = [];

    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => reject(error))
      .on('data', (row) => {
        try {
          validateRow(row);
          rows.push(row);
        } catch (error) {
          errors.push(error as Error['message']);
          throw new Error('Data validation failed in validateCsvFile.');
        }
      })
      .on('end', (rowCount: number) => {
        if (errors.length > 0) {
          reject(new Error(`Validation errors: ${errors.join(', ')}`));
        } else {
          console.log(`Parsed ${rowCount} rows`);
          resolve(rows);
        }
      });
  });
}

function validateRow(row: any) {
  const rowColumns = Object.keys(row);
  if (rowColumns.toString() !== COLUMNS.toString()) {
    throw new Error('Missing multiple columns in file.');
  }
  if (!row.gender) {
    throw new Error('Missing most important column data - gender is missing.');
  }
}

// @ts-ignore
const createArchive = async ({ output, files, outputFilePath }) => {
  return new Promise((resolve, reject) => {
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
        if (err) throw new Error('Cannot read file');
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
};

// @ts-ignore
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      errorMessage: 'No file found in request.',
    });
  } else {
    try {
      await validateCsvFile(req.file?.path);
      console.log('SUCCESS: File has been uploaded. Starting dividing CSV and zipping it.');
      res.status(200).json({
        message: 'File uploaded successfully.',
      });
      await transformCsvFile(req);
    } catch (e) {
      res.status(500).json({
        // @ts-ignore
        errorMessage: e.message,
      });
    }
  }
};

export const downloadFile = (req: Request, res: Response) => {
  fs.readFile(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send('lol');
      throw new Error('Cannot read file');
    } else {
      res.status(200).send(data);
      // @ts-ignore
      fs.unlink(file, (err) => {
        if (err) {
          console.error('file unliked', err);
        }
      });
    }
  });
};

const onEnd = async ({ file, maleStream, femaleStream, rowCount }: onEndInterface) => {
  fs.unlink(file.path, (err) => {
    if (err) throw err;
  });
  maleStream.end();
  femaleStream.end();
  console.log(`INFO: all data of csv have been done. Parsed ${rowCount} rows`);

  // ZIPPING PART
  console.log('INFO: start zipping');
  const outputFilePath = path.join(OUTPUT_FILE_PATH); // Chemin pour sauvegarder le fichier ZIP
  const output = fs.createWriteStream(outputFilePath);
  try {
    const files = [
      { path: MALE_FILE_PATH, name: 'GENDER_MALE_ONLY.csv' },
      { path: FEMALE_FILE_PATH, name: 'GENDER_FEMALE_ONLY.csv' },
    ];
    const zip = await createArchive({
      output,
      outputFilePath,
      files,
    });
    files.forEach((file: { path: fs.PathLike }) => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('ERROR: removing the csv file failed', err);
        }
      });
    });
    server.clients.forEach((client) => client.send(JSON.stringify(zip)));
  } catch (e) {
    console.error('ERROR: Zipping failed', e);
    throw new Error('Zipping failed');
  }
};

const createFilesAndHeaders = () => {
  const maleStream = fs.createWriteStream(MALE_FILE_PATH);
  const femaleStream = fs.createWriteStream(FEMALE_FILE_PATH);

  const headers = COLUMNS;
  maleStream.write(headers.join(',') + '\n');
  femaleStream.write(headers.join(',') + '\n');

  return { maleStream, femaleStream };
};
export const transformCsvFile = async (req: Request): Promise<void> => {
  if (req.file) {
    try {
      const { file } = req;
      const { maleStream, femaleStream } = createFilesAndHeaders();

      // PARSING CSV PART
      console.log('INFO: Starting parsing CSV.');
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
          console.error('ERROR: Could not parse CSV', error);
          // throw new Error('Could not parse CSV;');
        })
        .on('end', async (rowCount: number) =>
          onEnd({
            file,
            maleStream,
            femaleStream,
            rowCount,
          }),
        );
    } catch (e) {
      console.log('ERROR: Transform process failed', e);
      throw new Error('Transform process failed.');
    }
  } else {
    throw new Error('File not present in request.');
  }
};
