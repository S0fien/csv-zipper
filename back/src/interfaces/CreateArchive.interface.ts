import fs from "fs";

type FileType = {
  name: string,
  path: string,
}
export interface CreateArchiveInterface {
  output: fs.WriteStream,
  outputFilePath: string,
  files: FileType[]
}