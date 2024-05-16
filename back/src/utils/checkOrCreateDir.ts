import fs from 'fs';
import path from 'path';

export const checkOrCreateDir = (uploadsDirectory: string) => {
  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }
};

export const checkOrCreateFile = (filePath: string) => {
  const outputFilePath = path.join(filePath); // Chemin pour sauvegarder le fichier ZIP
  fs.writeFileSync(filePath, '', {});
};

export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
};
