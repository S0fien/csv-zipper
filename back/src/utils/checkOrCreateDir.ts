import fs from "fs";

export const checkOrCreateDir = (uploadsDirectory: string) => {
  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true })
  }
}
export const deleteFolderRecursive = (path: string) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      const curPath = path + "/" + file;
      deleteFolderRecursive(curPath);
      fs.rmdirSync(curPath);
    });
  }
}

export const deleteFile = (path: string) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}