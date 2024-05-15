import { Request, Response } from 'express';
import * as fs from 'fs';
import archiver from 'archiver';
import * as path from 'path';
import * as csv from 'fast-csv';
import server from '../utils/websocketServer';
// TODO: compare column type ?
type RowType = {
  uid: string;
  firstName: string;
  lastName: string;
  gender: string;
  date: string;
  randomString1: string;
  randomString2: string;
  randomString3: string;
  randomString4: string;
  randomString5: string;
  randomString6: string;
  randomString7: string;
};

const columns = [
  'uid',
  'firstName',
  'lastName',
  'gender',
  'date',
  'randomString1',
  'randomString2',
  'randomString3',
  'randomString4',
  'randomString5',
  'randomString6',
  'randomString7',
];

// @ts-ignore
let client = null;

// @ts-ignore
function validateCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const errors: any[] = [];
    const rows: unknown = [];

    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => reject(error))
      .on('data', (row) => {
        try {
          validateRow(row);
          // @ts-ignore
          rows.push(row);
        } catch (error) {
          // @ts-ignore
          errors.push(error.message);
          throw new Error('Data validation failed in validateCsvFile.');
        }
      })
      // @ts-ignore
      .on('end', (rowCount) => {
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
  if (rowColumns.toString() !== columns.toString()) {
    throw new Error('Missing multiple columns in file.');
  }
  if (!row.gender) {
    throw new Error('Missing most important column data - gender is missing.');
  }
}

// @ts-ignore
const createArchive = async ({ output, files, outputFilePath, res }) => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Niveau de compression
    });

    archive.pipe(output);
    // @ts-ignore
    files.forEach((file) => {
      archive.append(fs.createReadStream(file.path), { name: file.name });
    });
    archive.finalize();

    // output.on('close', () => {
    //   res.download(outputFilePath, 'download.zip', (err: any) => {
    //     if (err) {
    //       console.error('ERROR: download of the file failed', err);
    //       reject('Error downloading the file.');
    //     } else {
    //       // Delete ZIP and CSV
    //       fs.unlink(outputFilePath, (err) => {
    //         if (err) {
    //           console.error('ERROR: zip removing failed', err);
    //           reject('Error removing the zip file:');
    //         }
    //       });
    //       // @ts-ignore
    //       files.forEach((file) => {
    //         fs.unlink(file.path, (err) => {
    //           if (err){
    //             console.error('ERROR: removing the csv file failed', err);
    //             reject('Error while removing the csv file')
    //           }
    //         });
    //       });
    //       resolve('success');
    //     }
    //   });
    // });

    output.on('close', async () => {
      await fs.readFile(outputFilePath, (err, data) => {
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
        message: 'Failed to create archive',
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
    client = res;
    await validateCsvFile(req.file?.path)
      .then(async () => {
        console.log('SUCCESS: File has been uploaded. Starting dividing CSV and zipping it.');
        res.status(200).json({
          message: 'File uploaded successfully.',
        });
        await transformCsvFile(req, res);
      })
      .catch((e) => {
        res.status(500).json({
          // @ts-ignore
          errorMessage: e.message,
        });
      });
  }
};
export const transformCsvFile = async (req: Request, res: Response): Promise<void> => {
  if (req.file) {
    try {
      const file = req.file;

      // Chemins pour les fichiers de sortie
      // TODO : mettre chemin en constantes
      const maleFilePath = 'males.csv';
      const femaleFilePath = 'females.csv';

      // Créer des streams d'écriture pour les fichiers CSV basés sur le genre
      const maleStream = fs.createWriteStream(maleFilePath);
      const femaleStream = fs.createWriteStream(femaleFilePath);

      // Écrire l'en-tête pour les deux fichiers
      const headers = columns;
      maleStream.write(headers.join(',') + '\n');
      femaleStream.write(headers.join(',') + '\n');

      // PARSING CSV PART
      console.log('INFO: Starting parsing CSV.');

      const parsedCsv = csv.parse({ headers: true });

      fs.createReadStream(file.path)
        .pipe(parsedCsv)
        // @ts-ignore
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
          throw new Error('Could not parse CSV');
        })
        .on('end', async (rowCount: number) => {
          fs.unlink(file.path, (err) => {
            // Supprime le fichier temporaire
            if (err) throw err;
          });
          maleStream.end();
          femaleStream.end();
          console.log(`SUCCESS: all data of csv have been done. Parsed ${rowCount} rows`);

          // ZIPPING PART
          console.log('INFO: start zipping');
          // TODO : mettre chemin en constantes
          const outputFilePath = path.join('result.zip'); // Chemin pour sauvegarder le fichier ZIP
          const output = fs.createWriteStream(outputFilePath);
          try {
            const zip = await createArchive({
              output,
              outputFilePath,
              files: [
                { path: maleFilePath, name: 'males.csv' },
                { path: femaleFilePath, name: 'females.csv' },
              ],
              res,
            });
            // @ts-ignore
            server.clients.forEach((client) => client.send(JSON.stringify(zip)));
          } catch (e) {
            console.error('ERROR: Zipping failed', e);
            throw new Error('Zipping failed');
          }
        });
    } catch (e) {
      console.log('ERROR: Transform process failed', e);
      throw new Error('Transform process failed.');
    }
  } else {
    throw new Error('File not present in request.');
  }
};
