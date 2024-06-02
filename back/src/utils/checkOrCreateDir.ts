import fs from 'fs';
import path from 'path';

export const checkOrCreateDir = (uploadsDirectory: string) => {
  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }
};
export const deleteFolder = (filePath: string) => {
  try {
    const files = fs.readdirSync(filePath)
    files.forEach((filename) => {
      const fileName = path.join(filePath + '/' + filename)
      deleteFile(fileName)
    })
  } catch (err) {
    console.log(err);
  }
}

export const deleteFile = (path: string) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};